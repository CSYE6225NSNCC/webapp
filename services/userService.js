const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
const User = require('../models/userModel.js');
const {
    UserAlreadyExistsError,
    UserInputError
} = require("../errors/userErrors.js");

const sns = new AWS.SNS();
const VerificationToken = require('../models/verificationModel.js');


const cloudwatch = new AWS.CloudWatch();

const createNewUser = async ({ email, password, first_name, last_name }) => {
    const start = Date.now();

    // Check if the input data is provided
    if (!email || !password || !first_name || !last_name) {
        throw new UserInputError('Bad Request: All fields are required.');
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new UserAlreadyExistsError('User already exists');
    }

    // Password validation: at least 8 characters, one uppercase, one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new UserInputError('BadRequest: Invalid password.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        account_created: new Date(),
        account_updated: new Date(),
    });

    // Generate verification token
    const tokenExpiration = new Date(Date.now() + 2 * 60 * 1000); // 2-minute expiration
    console.log('tokenExpiration: ' + tokenExpiration);
    const verificationToken = await VerificationToken.create({
        user_id: newUser.id,
        expires_at: tokenExpiration,
    });
    console.log('verification token created successfully');
    // Publish SNS message
    const message = JSON.stringify({
        email,
        token: verificationToken.token,
    });
    console.log('message is: ' + message);
    await sns.publish({
        Message: message,
        TopicArn: process.env.VERIFICATION_TOPIC_ARN,
    }).promise();

    const duration = Date.now() - start;

    // Send metrics to CloudWatch
    await cloudwatch.putMetricData({
        MetricData: [
            {
                MetricName: 'UserCreationTime',
                Dimensions: [
                    { Name: 'User', Value: 'CreateUser' }
                ],
                Unit: 'Milliseconds',
                Value: duration,
            }
        ],
        Namespace: 'webapp' // Change this to your app's namespace
    }).promise();

    return newUser;
};

// API to update user information
const updateUser = async (user, { first_name, last_name, password }) => {
    const start = Date.now();

    // Check if the input data is valid
    if (!first_name && !last_name && !password) {
        throw new Error('Bad Request: At least one field is required for update.');
    }

    const updatedData = {};
    if (first_name) updatedData.first_name = first_name;
    if (last_name) updatedData.last_name = last_name;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    updatedData.account_updated = new Date();

    // Update user in the database
    await user.update(updatedData);

    const duration = Date.now() - start;

    // Send metrics to CloudWatch
    await cloudwatch.putMetricData({
        MetricData: [
            {
                MetricName: 'UserUpdateTime',
                Dimensions: [
                    { Name: 'User', Value: 'UpdateUser' }
                ],
                Unit: 'Milliseconds',
                Value: duration,
            }
        ],
        Namespace: 'webapp' // Change this to your app's namespace
    }).promise();

    return user;
};

// API to fetch user information
const fetchUser = async (user) => {
    const start = Date.now();

    const userData = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        account_created: user.account_created,
        account_updated: user.account_updated,
    };

    const duration = Date.now() - start;

    // Send metrics to CloudWatch
    await cloudwatch.putMetricData({
        MetricData: [
            {
                MetricName: 'UserFetchTime',
                Dimensions: [
                    { Name: 'User', Value: 'FetchUser' }
                ],
                Unit: 'Milliseconds',
                Value: duration,
            }
        ],
        Namespace: 'webapp' // Change this to your app's namespace
    }).promise();

    return userData;
};

module.exports = { createNewUser, updateUser, fetchUser };
