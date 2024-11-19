const express = require('express');
const {createUserController, updateUserController, getUserController} = require('../controllers/userController');
const {authenticateUser} = require("../authentication/basicAuth.js") ;
const {ensureVerifiedUser} = require('../middleware/isVerified.js');

const router = express.Router();

router.post("/", createUserController);
// Allow HEAD method to return 405 Method Not Allowed
router.head('/self', (req, res) => {
    return res.status(405).send();  // Method Not Allowed for HEAD
});
router.put("/self", authenticateUser, ensureVerifiedUser, updateUserController);
router.get("/self", authenticateUser, ensureVerifiedUser, getUserController);

// Catch-all for unsupported methods
router.all('/self', (req, res) => {
    return res.status(405).send();  // Method Not Allowed
});

module.exports = router;

