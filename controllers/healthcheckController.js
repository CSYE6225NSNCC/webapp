import connectDB from '../dbconnect/connectDB.js';

const getStatusController = async (req, res) => {
    // Check for payload
    if (req.method == 'GET' && req.headers['content-length'] > 0) {
        res.set('Cache-Control', 'no-cache'); // No caching
        return res.status(400).send(); // 400 Bad Request
    }
    if (req.method !== 'GET') {
      return res.status(405).send(); // For any request other than GET
    }
    try {
        await connectDB(); // Just ensure DB is connected
        res.set('Cache-Control', 'no-cache'); // No caching
        return res.status(200).send(); // 200 OK
    } catch (error) {
        console.error('Database connection failed:', error);
        res.set('Cache-Control', 'no-cache'); // No caching
        return res.status(503).send(); // 503 Service Unavailable
    }
};

export default getStatusController;
