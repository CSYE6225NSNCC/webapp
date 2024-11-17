
const express = require('express');
const router = express.Router();
const { uploadProfilePicture, getProfilePicture, deleteProfilePicture } = require('../controllers/photoController.js');
const {authenticateUser} = require("../authentication/basicAuth.js") ;
const upload = require('../middleware/multer.js'); 
const {ensureVerifiedUser} = require('../middlewares/ensureVerifiedUser.js');

// Route to upload a profile picture
router.post('/', authenticateUser,ensureVerifiedUser, upload.single('profilePic'), (req, res) => {
    uploadProfilePicture(req, res);
});

router.head('/', (req, res) => {
    return res.status(405).send();  // Method Not Allowed for HEAD
});

router.get('/', authenticateUser, ensureVerifiedUser, getProfilePicture);

router.delete('/', authenticateUser, ensureVerifiedUser, deleteProfilePicture);

// Catch-all for unsupported methods
router.all('/', (req, res) => {
    return res.status(405).send();  // Method Not Allowed
});

module.exports = router;