const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { createNewUser, updateUser, fetchUser } = require('../services/userService.js');
const dbHealthService = require('../services/healthcheckService.js');

const cloudwatch = new AWS.CloudWatch();

// Create a new user
const createUserController = async (req, res) => {
    const start = Date.now();

    try {
        const isDBHealthy = await dbHealthService.checkDBConnection();
        if (isDBHealthy) {
            if (Object.keys(req.query).length > 0) {
                await logUserMetrics('UserCreationInvalidQuery', start);
                return res.status(400).send();  // Bad Request
            }

            const { email, password, first_name, last_name } = req.body;

            if (!req.body || Object.keys(req.body).length === 0) {
                await logUserMetrics('UserCreationEmptyBody', start);
                return res.status(400).json({ message: 'Bad Request: Request body is required.' });
            }

            const newUser = await createNewUser({ email, password, first_name, last_name });
            await logUserMetrics('UserCreatedSuccessfully', start);
            return res.status(201).json({ message: 'User created successfully' });
        } else {
            await logUserMetrics('UserCreationDBNotHealthy', start);
            return res.status(503).json({ message: 'Service Unavailable.' });
        }
    } catch (error) {
        if (error.name === 'UserInputError' || error.name === 'UserAlreadyExistsError') {
            await logUserMetrics('UserCreationInputError', start);
            return res.status(400).json({ message: error.message });
        }

        console.error('Error creating user:', error);
        await logUserMetrics('UserCreationError', start);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get user information
const getUserController = async (req, res) => {
    const start = Date.now();

    try {
        const isDBHealthy = await dbHealthService.checkDBConnection();
        if (isDBHealthy) {
            if (req.headers['content-length'] > 0 || Object.keys(req.query).length > 0) {
                await logUserMetrics('UserFetchInvalidRequest', start);
                return res.status(400).json({ message: 'Query parameters or body are not allowed.' });
            }

            const userInfo = await fetchUser(req.user);
            await logUserMetrics('UserFetchedSuccessfully', start);
            return res.status(200).json(userInfo);
        } else {
            await logUserMetrics('UserFetchDBNotHealthy', start);
            return res.status(503).json({ message: 'Service Unavailable.' });
        }
    } catch (error) {
        await logUserMetrics('UserFetchError', start);
        return res.status(400).json({ message: error.message });
    }
};

// Update user information
const updateUserController = async (req, res) => {
    const start = Date.now();

    try {
        const isDBHealthy = await dbHealthService.checkDBConnection();
        if (isDBHealthy) {
            if (Object.keys(req.query).length > 0) {
                await logUserMetrics('UserUpdateInvalidQuery', start);
                return res.status(400).send();  // Bad Request
            }

            const { first_name, last_name, password } = req.body;

            if (!req.body || Object.keys(req.body).length === 0) {
                await logUserMetrics('UserUpdateEmptyBody', start);
                return res.status(400).json({ message: 'Bad Request: Request body is required.' });
            }

            if (req.body.email || req.body.account_created || req.body.account_updated) {
                await logUserMetrics('UserUpdateInvalidFields', start);
                return res.status(400).send();
            }

            const updatedData = {};
            if (first_name) updatedData.first_name = first_name;
            if (last_name) updatedData.last_name = last_name;
            if (password) updatedData.password = await bcrypt.hash(password, 10);

            updatedData.account_updated = new Date();
            await req.user.update(updatedData);
            await logUserMetrics('UserUpdatedSuccessfully', start);
            return res.status(204).send(); // No content after successful update
        } else {
            await logUserMetrics('UserUpdateDBNotHealthy', start);
            return res.status(503).json({ message: 'Service Unavailable.' });
        }
    } catch (error) {
        await logUserMetrics('UserUpdateError', start);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Logging function for CloudWatch
const logUserMetrics = async (metricName, start) => {
    const duration = Date.now() - start;

    await cloudwatch.putMetricData({
        MetricData: [
            {
                MetricName: metricName,
                Unit: 'Count',
                Value: 1,
            },
            {
                MetricName: 'UserRequestDuration',
                Unit: 'Milliseconds',
                Value: duration,
            },
        ],
        Namespace: 'webapp', // Change this to your app's namespace
    }).promise();
};

module.exports = { createUserController, getUserController, updateUserController };
