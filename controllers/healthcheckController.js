
const healthcheckService = require('../services/healthcheckService.js');

const getStatusController = async (req, res) => {
    // Check for payload
    if (req.method === 'GET' && ((req.headers['content-length'] > 0)|| Object.keys(req.query).length > 0)) {
        res.set('Cache-Control', 'no-cache'); // No caching
        console.log('Payload found, not allowed');
        return res.status(400).send(); // 400 Bad Request
    }
    if (req.method !== 'GET') {
        console.log('Method incorrect,please use GET method');
        return res.status(405).send(); // For any request other than GET
    }
    try {
        await healthcheckService.checkDBConnection(); // Ensure DB is connected
        res.set('Cache-Control', 'no-cache'); // No caching
        console.log('Healthcheck is ok');
        return res.status(200).send(); // 200 OK
    } catch (error) {
        console.error('Database connection failed:');
        res.set('Cache-Control', 'no-cache'); // No caching
        return res.status(503).send(); // 503 Service Unavailable
    }
};

module.exports= getStatusController;
