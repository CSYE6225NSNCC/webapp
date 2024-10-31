const AWS = require('aws-sdk');
const Image = require('../models/photoModel.js');
const StatsD = require('node-statsd');
const client = new StatsD();
const { v4:uuidv4 } = require('uuid');
const {
    PhotoAlreadyExistsError,
    PhotoDoesntExistError
} = require("../errors/photoErrors.js");

const cloudwatch = new AWS.CloudWatch();
const s3 = new AWS.S3();

const uploadOrUpdateProfilePictureService = async (userId, photoFile) => {
    const start = Date.now();

    try {
        // Check if the user already has a profile picture
        const existingPhoto = await Image.findOne({ where: { user_id: userId } });

        const {originalname, buffer} = photoFile;
        const fileExtension = originalname.split('.').pop().toLowerCase();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${userId}/${fileName}`,
            Body: buffer,
            ContentType: `image/${fileExtension}`
        };

        if (existingPhoto) {
            throw new PhotoAlreadyExistsError("Photo already exists");
        } else {
            // Upload the new photo
            await s3.upload(params).promise();
            const photo = await Image.create({
                file_name: fileName,
                url: `${process.env.S3_BUCKET_NAME}/${params.Key}`,
                upload_date: new Date(),
                user_id: userId,
            });
            return photo;
        }
    } finally {
        const duration = Date.now() - start;
        client.timing('photo_upload_time', duration);
        
        // Send metrics to CloudWatch
        await cloudwatch.putMetricData({
            MetricData: [
                {
                    MetricName: 'PhotoUploadTime',
                    Dimensions: [
                        { Name: 'Photo', Value: userId }
                    ],
                    Unit: 'Milliseconds',
                    Value: duration,
                }
            ],
            Namespace: 'webapp'
        }).promise();
    }
};

const getProfilePictureService = async (userId) => {
    const start = Date.now();

    try {
        const photo = await Image.findOne({
            where: { user_id: userId },
        });
        return photo;
    } finally {
        const duration = Date.now() - start;
        client.timing('photo_retrieve_time', duration);
        
        // Send metrics to CloudWatch
        await cloudwatch.putMetricData({
            MetricData: [
                {
                    MetricName: 'PhotoRetrieveTime',
                    Dimensions: [
                        { Name: 'Photo', Value: userId }
                    ],
                    Unit: 'Milliseconds',
                    Value: duration,
                }
            ],
            Namespace: 'webapp'
        }).promise();
    }
};

const deleteProfilePictureService = async (userId) => {
    const start = Date.now();

    try {
        const photo = await Image.findOne({
            where: { user_id: userId },
        });

        if (photo) {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: photo.url.split('/').slice(1).join('/')
            };
            await s3.deleteObject(params).promise();
            await photo.destroy();
        } else {
            throw new PhotoDoesntExistError("Profile picture not found");
        }
    } finally {
        const duration = Date.now() - start;
        client.timing('photo_delete_time', duration);
        
        // Send metrics to CloudWatch
        await cloudwatch.putMetricData({
            MetricData: [
                {
                    MetricName: 'PhotoDeleteTime',
                    Dimensions: [
                        { Name: 'Photo', Value: userId }
                    ],
                    Unit: 'Milliseconds',
                    Value: duration,
                }
            ],
            Namespace: 'webapp'
        }).promise();
    }
};

module.exports = {
    uploadOrUpdateProfilePictureService,
    getProfilePictureService,
    deleteProfilePictureService,
};
