const basicAuth = require('basic-auth');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); // Assuming Sequelize User model
const dbHealthService = require('../services/healthcheckService.js');

const authenticateUser = async (req, res, next) => {
    const userCredentials = basicAuth(req);
    if (!userCredentials) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, pass } = userCredentials;
    
    try {
        const isDBHealthy = await dbHealthService.checkDBConnection();
        if (isDBHealthy) {
        const user = await User.findOne({ where: { email: name } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Authenticated user is attached to the request object
        req.user = user;
        next();
    }
    else{
        return res.status(503).json({ message: 'Service Unavailable.' });
    }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { authenticateUser };
