const httpMocks = require('node-mocks-http');
const healthcheckService = require('../services/healthcheckService.js');
const getStatusController = require('../controllers/healthcheckController.js');

jest.mock('../services/healthcheckService.js'); // Mock the healthcheckService

describe('Health Check Controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest(); // Create a mock request
        res = httpMocks.createResponse(); // Create a mock response
    });

    test('should return 400 for non-GET requests', async () => {
        req.method = 'POST'; // Set method to POST
        await getStatusController(req, res);
        expect(res.statusCode).toBe(405); // Expect 405 Method Not Allowed
    });

    test('should return 400 for GET requests with payload', async () => {
        req.method = 'GET';
        req.headers['content-length'] = 1; // Simulate a non-empty payload
        await getStatusController(req, res);
        expect(res.statusCode).toBe(400); // Expect 400 Bad Request
    });

    test('should return 503 if DB connection fails', async () => {
        req.method = 'GET'; // Set method to GET
        healthcheckService.checkDBConnection.mockImplementationOnce(() => {
            throw new Error('DB connection failed'); // Simulate DB failure
        });

        await getStatusController(req, res);
        expect(res.statusCode).toBe(503); // Expect 503 Service Unavailable
    });

    test('should return 200 if DB connection is successful', async () => {
        req.method = 'GET'; // Set method to GET
        healthcheckService.checkDBConnection.mockImplementationOnce(() => Promise.resolve()); // Simulate successful DB connection

        await getStatusController(req, res);
        expect(res.statusCode).toBe(200); // Expect 200 OK
    });

});
