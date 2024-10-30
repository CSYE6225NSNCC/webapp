const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbconnect/connectDB.js');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    file_name: {
        type: DataTypes.STRING, // Assuming file_name is a string
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING, // Assuming URL is a string
        allowNull: false,
    },
    upload_date: {
        type: DataTypes.DATE, // Date type for upload_date
        allowNull: false,
        defaultValue: DataTypes.NOW, // Default to the current date
    },
    user_id: {
        type: DataTypes.UUID, // Assuming user_id references the user
        allowNull: false,
        references: {
            model: 'users', // Ensure this matches your users table/model
            key: 'id',
        },
    },
}, {
    timestamps: false, // Disable default timestamps if not needed
});

module.exports = Image;