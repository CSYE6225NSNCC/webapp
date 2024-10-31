const AWS = require('aws-sdk');
const {
    uploadOrUpdateProfilePictureService,
    getProfilePictureService,
    deleteProfilePictureService,
} = require('../services/photoService');

const cloudwatch = new AWS.CloudWatch();

const logMetrics = async (metricName, userId, duration, success = true) => {
    await cloudwatch.putMetricData({
        MetricData: [
            {
                MetricName: success ? `${metricName}Success` : `${metricName}Failure`,
                Dimensions: [{ Name: 'UserId', Value: userId }],
                Unit: 'Count',
                Value: 1,
            },
            {
                MetricName: `${metricName}Duration`,
                Dimensions: [{ Name: 'UserId', Value: userId }],
                Unit: 'Milliseconds',
                Value: duration,
            },
        ],
        Namespace: 'webapp', // Replace with your app's namespace
    }).promise();
};

const uploadProfilePicture = async (req, res) => {
    const start = Date.now();
    try {
        const userId = req.user.id; 
        const photoFile = req.file; 

        if (!photoFile) {
            return res.status(400).json({ error: "Profile picture is required" });
        }

        const photo = await uploadOrUpdateProfilePictureService(userId, photoFile);
        const response = {
            file_name: photo.file_name,
            id: photo.id,
            url: photo.url,
            upload_date: photo.upload_date.toISOString().split('T')[0],
            user_id: userId
        };

        await logMetrics('Upload', userId, Date.now() - start);
        return res.status(201).json(response);
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        await logMetrics('Upload', req.user.id, Date.now() - start, false);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getProfilePicture = async (req, res) => {
    const start = Date.now();
    try {
        const userId = req.user.id; 
        const photo = await getProfilePictureService(userId);

        if (!photo) {
            return res.status(404).json({ error: "Profile picture not found" });
        }

        const response = {
            url: photo.url,
            contentType: photo.contentType,
            user_id: userId
        };

        await logMetrics('Fetch', userId, Date.now() - start);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving profile picture:", error);
        await logMetrics('Fetch', req.user.id, Date.now() - start, false);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteProfilePicture = async (req, res) => {
    const start = Date.now();
    try {
        const userId = req.user.id; 
        await deleteProfilePictureService(userId);
        await logMetrics('Delete', userId, Date.now() - start);
        return res.status(204).json(); 
    } catch (error) {
        console.error("Error deleting profile picture:", error);
        await logMetrics('Delete', req.user.id, Date.now() - start, false);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    uploadProfilePicture,
    getProfilePicture,
    deleteProfilePicture,
};
