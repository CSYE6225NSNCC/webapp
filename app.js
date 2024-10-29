const express =require("express") ;
const healthcheckRoutes = require("./routes/healthcheckRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const photoRoutes = require("./routes/photoRoutes.js");

const { connectDB, sequelize } = require("./dbconnect/connectDB.js");


const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/healthz",healthcheckRoutes); 
app.use("/v1/user",userRoutes);
app.use("/v1/user/self/pic", photoRoutes);


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