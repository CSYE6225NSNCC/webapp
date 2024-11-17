const VerificationToken  = require('../models/verificationModel');
const User = require('../models/userModel');

const ensureVerifiedUser = async (req, res, next) => {
    try {
      const latestToken = await VerificationToken.findOne({
        where: { user_id: req.user.id },
        order: [["expires_at", "DESC"]], // Get the most recent token
      });

    // Fetch the user and check the verification status
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    if (!user.is_verified) {
        return res.status(403).json({ error: "Email not verified." });
    }

      next();
    } catch (error) {
      console.error("Error checking verification:", error);
      res.status(500).json({ error: "Internal Server Error"});
    }
  };

  module.exports = {ensureVerifiedUser};