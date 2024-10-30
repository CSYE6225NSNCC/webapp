const AWS = require('aws-sdk');
const Image = require('../models/photoModel.js'); // Update to use the new Image model

const s3 = new AWS.S3();

const uploadOrUpdateProfilePictureService = async (userId, photoFile) => {
    // Check if the user already has a profile picture
    const existingPhoto = await Image.findOne({ where: { user_id: userId } });

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${userId}/${photoFile.originalname}`, // Use userId as part of the S3 key for organization
        Body: photoFile.buffer,
        ContentType: photoFile.mimetype,
    };

    if (existingPhoto) {
        throw new Error("Photo already exists");
    } else {
        // Create a new Image instance
        await s3.upload(params).promise(); // Upload the new photo
        const photo = await Image.create({
            file_name: photoFile.originalname,
            url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`, // Store the URL in the database
            upload_date: new Date(), // Set the upload date
            user_id: userId,
        });
        return photo; // Return the saved photo object
    }
};

const getProfilePictureService = async (userId) => {
    const photo = await Image.findOne({
        where: { user_id: userId },
    });
    return photo; // Return the photo object or null if not found
};

const deleteProfilePictureService = async (userId) => {
    const photo = await Image.findOne({
        where: { user_id: userId },
    });

    if (photo) {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: photo.url.split('/').pop(), // Get the key from the URL
        };
        await s3.deleteObject(params).promise(); // Delete the photo from S3
        await photo.destroy(); // Delete the photo from the database
    } else {
        throw new Error("Profile picture not found");
    }
};

module.exports = {
    uploadOrUpdateProfilePictureService,
    getProfilePictureService,
    deleteProfilePictureService,
};
