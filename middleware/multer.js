const multer = require('multer');

// Set up storage options
const storage = multer.memoryStorage(); // Store file in memory (useful for images)

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
        // Allow only certain file types
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase());

        if (!mimetype || !extname) {
            return cb(new Error("File type not allowed. Only JPEG, PNG, and GIF files are allowed."));
        }

        cb(null, true); // Accept the file
    },
});

// Export the multer upload middleware
module.exports = upload;
