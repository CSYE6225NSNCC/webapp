const express = require('express');
const { verifyUserController } = require('../controllers/verificationController');
const router = express.Router();

router.get("/", verifyUserController);

module.exports = router;
