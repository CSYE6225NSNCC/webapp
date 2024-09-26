import express from "express";
import healthcheckRoutes from "./routes/healthcheckRoutes.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use("/healthz",healthcheckRoutes); 

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
