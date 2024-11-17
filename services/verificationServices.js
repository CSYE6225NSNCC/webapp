const VerificationToken = require('../models/verificationModel.js');
const User = require('../models/userModel.js');


const verifyEmail = async (token) => {
  const response = {
    success: false,
    message: "",
    isUserVerified: false,
  };

  const verificationToken = await VerificationToken.findOne({ where: { token } });

  if (!verificationToken) {
    response.message = "Token not found or invalid.";
    return response;
  }

  if (verificationToken.expires_at < new Date()) {
    response.message = "Token expired.";
    return response;
  }

  const user = await User.findByPk(verificationToken.user_id);
  if (!user) {
    response.message = "User not found.";
    return response;
  }

  // Mark user as verified and delete the token
  user.is_verified = true;
  await user.save();
  await verificationToken.destroy();

  response.success = true;
  response.message = "Email verified successfully.";
  response.isUserVerified = true;
  return response;
};

module.exports = {
  verifyEmail,
};
