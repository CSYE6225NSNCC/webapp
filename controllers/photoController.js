const {
    uploadOrUpdateProfilePictureService,
    getProfilePictureService,
    deleteProfilePictureService,
} = require('../services/photoService');

const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const photoFile = req.file; // Assuming you are using multer to handle file uploads

        if (!photoFile) {
            return res.status(400).json({ error: "Profile picture is required" });
        }

        const photo = await uploadOrUpdateProfilePictureService(userId, photoFile);
        const response = {
            file_name: photoFile.originalname, // Original file name
            id: photo.id, // Assuming photo.id is the UUID generated
            url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${photo.s3Key}`, // Construct the URL
            upload_date: new Date().toISOString().split('T')[0], // Format the date as 'YYYY-MM-DD'
            user_id: userId // The ID of the user who uploaded the photo
        };
        return res.status(201).json(response);
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const photo = await getProfilePictureService(userId);

        if (!photo) {
            return res.status(404).json({ error: "Profile picture not found" });
        }

        // Return the photo URL
        const response = {
            url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${photo.s3Key}`,
            contentType: photo.contentType,
            user_id: userId
        };
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving profile picture:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        await deleteProfilePictureService(userId);
        return res.status(204).json(); // No content to send back
    } catch (error) {
        console.error("Error deleting profile picture:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    uploadProfilePicture,
    getProfilePicture,
    deleteProfilePicture,
};
