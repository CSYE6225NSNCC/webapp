const { User, VerificationToken } = require('../models/verificationModel.js');

const ensureVerifiedUser = async (req, res, next) => {
    try {
      const latestToken = await VerificationToken.findOne({
        where: { user_id: req.user.id },
        order: [["expires_at", "DESC"]], // Get the most recent token
      });
  
      if (!latestToken) {
        return res.status(403).json({ error: "Verification token not found" });
      }
  
      if (!latestToken.verified) {
        return res.status(403).json({ error: "Email not verified" });
      }
  
      next();
    } catch (error) {
      console.error("Error checking verification:", error);
      res.status(500).json({ error: "Internal Server Error"});
    }
  };

  module.exports = ensureVerifiedUser;