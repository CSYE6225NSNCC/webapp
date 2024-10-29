
const express = require('express');
const router = express.Router();
const { uploadProfilePicture, getProfilePicture, deleteProfilePicture } = require('../controllers/photoController.js');
const {authenticateUser} = require("../authentication/basicAuth.js") ;
const upload = require('../middleware/multer.js'); 

router.post('/', authenticateUser, upload.single('profilePic'), uploadProfilePicture);

router.head('/', (req, res) => {
    return res.status(405).send();  // Method Not Allowed for HEAD
});

router.get('/', authenticateUser, getProfilePicture);

router.delete('/', authenticateUser, deleteProfilePicture);

// Catch-all for unsupported methods
router.all('/', (req, res) => {
    return res.status(405).send();  // Method Not Allowed
});

module.exports = router;