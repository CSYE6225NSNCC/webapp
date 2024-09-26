# Health Check API with MySQL Connection

This project provides a simple API endpoint to check the health status of the application. It connects to a MySQL database and verifies the connection. The API is built using Node.js and Express.

## Prerequisites

- Node.js (version 12 or higher)
- MySQL server (version 5.7 or higher recommended)

## Usage

    Set up your MySQL database:
        Ensure your MySQL server is running.
        Create a database named demo or change the database name in the .env file accordingly.

    Run the application:

    bash

    node app.js

    The application will connect to the MySQL database, and you can check the connection status via the API.

Environment Variables

Create a .env file in the root of the project with the following content:

plaintext

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=demo

Replace your_password with your actual MySQL root password.
API Endpoints
GET /

    Description: Checks the status of the application and verifies the MySQL database connection.
    Responses:
        200 OK: Successfully connected to the database.
        400 Bad Request: If the GET request contains a body or content length greater than 0.
        405 Method Not Allowed: For any request method other than GET.
        503 Service Unavailable: If the database connection fails.

Example Request

To test the endpoint, use a tool like Postman or curl

