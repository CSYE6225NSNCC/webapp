const httpMocks = require('node-mocks-http');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { createNewUser, updateUser, fetchUser } = require('../services/userService');
const dbHealthService = require('../services/healthcheckService');
const {
    createUserController,
    getUserController,
    updateUserController,
} = require('../controllers/userController');

jest.mock('../services/userService');
jest.mock('../services/healthcheckService');
jest.mock('bcrypt');

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    describe('createUserController', () => {
             

        test('should return 503 if DB is unhealthy', async () => {
            const req = {
                body: {},
                query: {}
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(), // Mock json method
            };
        
            // Mock the database health check to return false
            dbHealthService.checkDBConnection.mockResolvedValue(false);
        
            await createUserController(req, res);
        
            expect(res.status).toHaveBeenCalledWith(503);
            expect(res.json).toHaveBeenCalledWith({ message: 'Service Unavailable.' });
        });
        

        test('should return 201 when user is created successfully', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                    first_name: 'Test',
                    last_name: 'User',
                },
                query: {}
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(), // Mock json method
            };
        
            // Mock the database health check to return true
            dbHealthService.checkDBConnection.mockResolvedValue(true);
        
            // Mock the user creation service to simulate user creation
            createNewUser.mockResolvedValue();
        
            await createUserController(req, res);
        
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
        });
        
        // New failing test case
        test('this test will fail', () => {
            expect(true).toBe(false); // This will always fail
        });
        
    });


    describe('getUserController', () => {
        test('should return 503 if DB is unhealthy', async () => {
            const req = {}; // Mock the request as needed
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(), // Mock json method
            };
        
            // Simulate an unhealthy DB condition
            dbHealthService.checkDBConnection.mockResolvedValue(false);
        
            await getUserController(req, res);
        
            // Check that status and json methods were called with the correct arguments
            expect(res.status).toHaveBeenCalledWith(503);
            expect(res.json).toHaveBeenCalledWith({ message: 'Service Unavailable.' });
        });
        

        test('should return 200 with user info', async () => {
            const req = {
                headers: {},
                user: {
                    id: 1,
                    email: "test@example.com",
                    first_name: "Test",
                    last_name: "User"
                },
                query: {}
            };
        
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(), // Mock json method
            };
        
            // Mock the database health check to return true
            dbHealthService.checkDBConnection.mockResolvedValue(true);
            // Mock the fetchUser to return the user info
            fetchUser.mockResolvedValue(req.user);
        
            await getUserController(req, res);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(req.user); // This should match req.user
        });
        
    });

    describe('updateUserController', () => {
        test('should return 503 if DB is unhealthy', async () => {
            // Mock the request and response
            const req = { query: {} }; // Assume no query parameters
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(), // Mock json method
            };
        
            // Simulate unhealthy DB state
            dbHealthService.checkDBConnection = jest.fn().mockResolvedValue(false);
        
            // Call the controller
            await createUserController(req, res);
        
            // Check that status and json methods were called with the correct arguments
            expect(res.status).toHaveBeenCalledWith(503);
            expect(res.json).toHaveBeenCalledWith({ message: 'Service Unavailable.' });
        });
        

        test('should return 204 on successful update', async () => {
            dbHealthService.checkDBConnection.mockResolvedValue(true);
            req.user = { update: jest.fn() }; // Mock user update method
            req.body = { first_name: 'Updated' };
            await updateUserController(req, res);
            expect(res.statusCode).toBe(204);
            expect(req.user.update).toHaveBeenCalledWith({
                first_name: 'Updated',
                account_updated: expect.any(Date),
            });
        });

        test('should return 400 if request body is empty', async () => {
            // Prepare request and response mocks
            const req = { body: {}, query: {} }; // Empty body
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
        
            // Call the controller
            await createUserController(req, res);
        
            // Check the status and json methods were called with the correct arguments
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request: Request body is required.' });
        });
        

        test('should return 400 if invalid fields are included', async () => {
            dbHealthService.checkDBConnection.mockResolvedValue(true);
            req.user = { update: jest.fn() }; // Mock user update method
            req.body = { email: 'newemail@example.com' }; // Invalid field

            await updateUserController(req, res);
            expect(res.statusCode).toBe(400);
        });
    });
});
