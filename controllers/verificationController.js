const { verifyEmail } = require('../services/verificationServices.js');

const verifyUserController = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Invalid verification token." });
  }

  try {
    const result = await verifyEmail(token);
    if (result.success) {
      console.log("Email verified");
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { verifyUserController };
  