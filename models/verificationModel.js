const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbconnect/connectDB.js');

const VerificationToken = sequelize.define('VerificationToken', {
    token: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'verification_tokens',
    timestamps: false,
});

module.exports = VerificationToken;
