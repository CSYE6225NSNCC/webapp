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
            console.error("Profile picture is required");
            return res.status(400).json({ error: "Profile picture is required" });
        }

        const photo = await uploadOrUpdateProfilePictureService(userId, photoFile);
        const response = {
            file_name: photo.file_name, // Use the updated field name
            id: photo.id, // Assuming photo.id is the UUID generated
            url: photo.url, // Use the URL generated in the service
            upload_date: photo.upload_date.toISOString().split('T')[0], // Format the date as 'YYYY-MM-DD'
            user_id: userId // The ID of the user who uploaded the photo
        };
        console.log("Image uploaded successfully");
        return res.status(201).json(response);
    } catch (error) {
        if (error.name ===  'PhotoAlreadyExistsError') {
            console.error("Photo already exists");
            return res.status(400).json({ message: error.message });
        }
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

        // Return the photo URL and other relevant information
        const response = {
            file_name: photo.file_name, // Use the updated field name
            id: photo.id,
            url: photo.url, // Use the URL generated in the service
            upload_date: photo.upload_date.toISOString().split('T')[0],
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
        console.log("Profile picture deleted successfully");
        return res.status(204).json(); // No content to send back
    } catch (error) {
        if (error.name ===  'PhotoDoesntExistError') {
            console.error("Profile picture does not exist");
            return res.status(404).json({ message: error.message });
        }
        console.error("Error deleting profile picture:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    uploadProfilePicture,
    getProfilePicture,
    deleteProfilePicture,
};
