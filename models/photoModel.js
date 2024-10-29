const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbconnect/connectDB.js');

const Photo = sequelize.define('Photo', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    contentType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uploadedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    s3Key: { // Add a field to store S3 key
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Photo;