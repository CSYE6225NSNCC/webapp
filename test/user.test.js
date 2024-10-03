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
        test('should return 400 if request body is empty', async () => {
            await createUserController(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData()).toEqual({ message: 'Bad Request: Request body is required.' });
        });

        test('should return 503 if DB is unhealthy', async () => {
            dbHealthService.checkDBConnection.mockResolvedValue(false);

            req.body = { email: 'test@example.com', password: 'password123', first_name: 'Test', last_name: 'User' };
            await createUserController(req, res);
            expect(res.statusCode).toBe(503);
            expect(res._getData()).toEqual({ message: 'Service Unavailable.' });
        });

        test('should return 201 when user is created successfully', async () => {
            dbHealthService.checkDBConnection.mockResolvedValue(true);
            createNewUser.mockResolvedValue({ email: 'test@example.com' });

            req.body = { email: 'test@example.com', password: 'password123', first_name: 'Test', last_name: 'User' };
            await createUserController(req, res);
            expect(res.statusCode).toBe(201);
            expect(res._getData()).toEqual({ message: 'User created successfully' });
        });

        test('should return 400 if user already exists', async () => {
            dbHealthService.checkDBConnection.mockResolvedValue(true);
            createNewUser.mockRejectedValue({ name: 'UserAlreadyExistsError', message: 'User already exists' });

            req.body = { email: 'test@example.com', password: 'password123', first_name: 'Test', last_name: 'User' };
            await createUserController(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData()).toEqual({ message: 'User already exists' });
        });
    });

    describe('getUserController', () => {
        test('should return 503 if DB is unhealthy', async () => {
            dbHealthService.checkDBConnection.mockResolvedValue(false);
            await getUserController(req, res);
            expect(res.statusCode).toBe(503);
            expect(res._getData()).toEqual({ message: 'Service Unavailable.' });
        });

        test('should return 200 with user info', async () => {
            dbHealthService.checkDBConnection.mockResolvedValue(true);
            req.user = { id: 1, first_name: 'Test', last_name: 'User', email: 'test@example.com' };
            fetchUser.mockResolvedValue(req.user);

            await getUserController(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getData()).toEqual(req.user);
        });
    });

    describe('updateUserController', () => {
        test('should return 503 if DB is unhealthy', async () => {
            dbHealthService.checkDBConnection.mockResolvedValue(false);
            await updateUserController(req, res);
            expect(res.statusCode).toBe(503);
            expect(res._getData()).toEqual({ message: 'Service Unavailable.' });
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
            dbHealthService.checkDBConnection.mockResolvedValue(true);
            await updateUserController(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData()).toEqual({ message: 'Bad Request: Request body is required.' });
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
