const express =require("express") ;
const healthcheckRoutes = require("./routes/healthcheckRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const photoRoutes = require("./routes/photoRoutes.js");
const logMetrics = require('./middleware/metricsLogger.js'); // Import the metrics logger

const { connectDB, sequelize } = require("./dbconnect/connectDB.js");


const app = express();

app.use(express.json());

// Apply metrics logger middleware globally
app.use(logMetrics);

const PORT = process.env.PORT || 3000;

app.use("/healthz",healthcheckRoutes); 
app.use("/v1/user",userRoutes);
app.use("/v1/user/self/pic", photoRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message }); // Handle multer-specific errors
    }
    if (err) {
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
    next(); // Pass the error to the next middleware if it's not handled
});

// Start the server
const startServer = async () => {
    try {
        await connectDB(); // Connect to the database
        await sequelize.sync(); // Sync the database models
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();