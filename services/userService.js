
const bcrypt = require('bcrypt');
const User =require ('../models/userModel.js');
const {
    UserAlreadyExistsError,
    UserInputError
}=require( "../errors/userErrors.js");


const createNewUser = async ({ email, password, first_name, last_name }) => {
    // Check if the input data is provided
    if (!email || !password || !first_name || !last_name) {
        throw new UserInputError('Bad Request: All fields are required.');
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new UserAlreadyExistsError('User already exists');
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

    return newUser;
};

// API to update user information
const updateUser = async (user, { first_name, last_name, password }) => {
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
    return user;
};


// Api to fetch user information
const fetchUser = async (user) => {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        account_created: user.account_created,
        account_updated: user.account_updated,
    };
};

module.exports ={createNewUser, updateUser, fetchUser}