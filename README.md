Health Check API with MySQL Connection and User Management

This project provides an API to check the health status of the application and manage user accounts. It connects to a MySQL database to verify the connection and supports user creation, retrieval, and updates. The API is built using Node.js and Express.

# Table of Contents

    Prerequisites
    Installation
    Usage
    Environment Variables
    API Endpoints
        Health Check Endpoint
        User Management Endpoints
    Example Requests
    Testing
    License

# Prerequisites

    Node.js (version 12 or higher)
    MySQL server (version 5.7 or higher recommended)

# Installation

    Clone this repository:

    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name

    Install the required dependencies:

    npm install

    Create a .env file in the root of the project and add your database credentials.

# Usage

    Set up your MySQL database:
        Ensure your MySQL server is running.
        Create a database named demo or modify the database name in the .env file accordingly.

    Run the application:

    node app.js

    The application will connect to the MySQL database, and you can check the connection status via the API.

# Environment Variables

Create a .env file in the root of the project with the following content:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=demo

Replace your_password with your actual MySQL root password.

# API Endpoints

# Health Check Endpoint

GET /healthz

    Description: Checks the status of the application and verifies the MySQL database connection.
    Responses:
        200 OK: Successfully connected to the database.
        400 Bad Request: If the GET request contains a body or content length greater than 0.
        405 Method Not Allowed: For any request method other than GET.
        503 Service Unavailable: If the database connection fails.

# User Management Endpoints
Create User

POST /v1/user

    Description: Creates a new user in the database.
    Request Body:

    {
      "email": "test@example.com",
      "password": "your_password",
      "first_name": "First",
      "last_name": "Last"
    }

    Responses:
        201 Created: User created successfully.
        400 Bad Request: If the request body is empty, the user already exists, or contains invalid fields.
        503 Service Unavailable: If the database connection fails.

Get User

GET /v1/user

    Description: Retrieves the logged-in user's information.
    Responses:
        200 OK: Successfully retrieved user information.
        400 Bad Request: If query parameters or body are included in the request.
        503 Service Unavailable: If the database connection fails.

Update User

PUT /v1/user

    Description: Updates the logged-in user's information.
    Request Body:

    {
      "first_name": "UpdatedFirst",
      "last_name": "UpdatedLast",
      "password": "new_password"
    }

    Responses:
        204 No Content: User information updated successfully.
        400 Bad Request: If the request body is empty, invalid fields are included, or email/account fields are attempted to be updated.
        503 Service Unavailable: If the database connection fails.

# Testing

To run the tests for this application, use the following command:

npm test

Ensure that your database is running and accessible during testing.