const AWS = require('aws-sdk');
const  Photo  = require('../models/photoModel.js'); 

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadOrUpdateProfilePictureService = async (userId, photoFile) => {
    // Check if the user already has a profile picture
    const existingPhoto = await Photo.findOne({where: { uploadedBy: userId }});

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${userId}/${photoFile.originalname}`, // Use userId as part of the S3 key for organization
        Body: photoFile.buffer,
        ContentType: photoFile.mimetype,
    };

    if (existingPhoto) {
        throw new Error('Photo already exists');
    } else {
        // Create a new Photo instance
        const photo = await Photo.create({
            data: null, // Not needed for S3
            contentType: photoFile.mimetype,
            uploadedBy: userId,
            s3Key: `${userId}/${photoFile.originalname}`, // Store the S3 key in the database
        });
        await s3.putObject(params).promise();
        return photo; // Return the saved photo object
    }
};

const getProfilePictureService = async (userId) => {
    const photo = await Photo.findOne({
        where: { uploadedBy: userId },
    });
    return photo; // Return the photo object or null if not found
};

const deleteProfilePictureService = async (userId) => {
    const photo = await Photo.findOne({
        where: { uploadedBy: userId },
    });

    if (photo) {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: photo.s3Key,
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