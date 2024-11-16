const VerificationToken = require('../models/verificationModel.js');
const User = require('../models/userModel.js');

const verifyUserController = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Invalid verification token." });
    }

    const verificationToken = await VerificationToken.findOne({ where: { token } });
    
    if (!verificationToken || verificationToken.expires_at < new Date()) {
        return res.status(400).json({ message: "Token expired or invalid." });
    }

    const user = await User.findByPk(verificationToken.user_id);
    if (user) {
        user.is_verified = true;
        await user.save();
        await verificationToken.destroy();
        console.log("Email verified");
        return res.status(200).json({ message: "Email verified successfully." });
    } else {
        return res.status(404).json({ message: "User not found." });
    }
};

module.exports = { verifyUserController };
