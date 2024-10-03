const { sequelize } = require('../dbconnect/connectDB.js');

const checkDBConnection = async () => {
    try {
        await sequelize.authenticate();
        return true;
    } catch (error) {
        return false;

    }
};

module.exports = { checkDBConnection };