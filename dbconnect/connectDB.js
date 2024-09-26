import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from.env file

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const connectDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Error connecting to the database", err);
                return reject(err);
            }
            console.log(`Connected to ${connection.config.host}`);
            connection.release(); // Release the connection back to the pool
            resolve();
        });
    });
};

export default connectDB;
