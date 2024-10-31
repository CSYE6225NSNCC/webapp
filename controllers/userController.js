const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const {createNewUser, updateUser, fetchUser}= require('../services/userService.js');
const dbHealthService = require('../services/healthcheckService.js');

// Create a new user
const createUserController = async (req, res) => {

    try {
        const isDBHealthy = await dbHealthService.checkDBConnection();
        if (isDBHealthy){
            if (Object.keys(req.query).length > 0) {
                console.error('Bad request');
                return res.status(400).send();  // Bad Request
            }
            const { email, password, first_name, last_name } = req.body;
        
            // Check if the request body is empty
            if (!req.body || Object.keys(req.body).length === 0) {
                console.error('Bad request');
                return res.status(400).json({ message: 'Bad Request: Request body is required.' });
            }
            // Call the userService to create a new user
            const newUser = await createNewUser({ email, password, first_name, last_name });
            console.log("User created successfully");
            return res.status(201).json({ message: 'User created successfully'});
        }
        else{
            console.error("DB is unavailable");
            return res.status(503).json({ message: 'Service Unavailable.' });
        }
    } catch (error) {
        // Handle service errors
        if (error.name === 'UserInputError' || error.name === 'UserAlreadyExistsError') {
            console.log(error.message);
            return res.status(400).json({ message: error.message });
        }
        
        // For any other unexpected errors
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get user information
const getUserController = async (req, res) =>  {

    try {
        const isDBHealthy = await dbHealthService.checkDBConnection();
        if (isDBHealthy) {
            if (req.headers['content-length'] > 0 || Object.keys(req.query).length > 0) {
                console.error('Query parameters or body are not allowed.');
                return res.status(400).json({ message: 'Query parameters or body are not allowed.' });
            }
            const userInfo = await fetchUser(req.user);
            console.log("User information fetched successfully");
            return res.status(200).json(userInfo);
        } else {
            console.error("DB is unavailable");
            return res.status(503).json({ message: 'Service Unavailable.' });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Update user information
const updateUserController = async (req, res) => {
    try {
        const isDBHealthy = await dbHealthService.checkDBConnection();
        if (isDBHealthy) {

            if (Object.keys(req.query).length > 0) {
                console.error('Bad request');
                return res.status(400).send();  // Bad Request
            }
            const { first_name, last_name, password } = req.body;
        
            // Check if the request body is empty
            if (!req.body || Object.keys(req.body).length === 0) {
                console.error('Bad Request: Request body is required.');
                return res.status(400).json({ message: 'Bad Request: Request body is required.' });
            }
        
            if(req.body.email||req.body.account_created||req.body.account_updated){
                console.error('Invalid parameters');
                return res.status(400).send()
            }
    
        const updatedData = {};
        if (first_name) updatedData.first_name = first_name;
        if (last_name) updatedData.last_name = last_name;
        if (password) updatedData.password = await bcrypt.hash(password, 10);
    
        updatedData.account_updated = new Date();
        await req.user.update(updatedData);
        console.log("User information updated successfully");
        return res.status(204).send(); // No content after successful update

        }
        else {
            console.error("DB is unavailable");
            return res.status(503).json({ message: 'Service Unavailable.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createUserController, getUserController, updateUserController };
