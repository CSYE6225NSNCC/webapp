const AWS = require('aws-sdk');
const healthcheckService = require('../services/healthcheckService.js');

const cloudwatch = new AWS.CloudWatch();

const getStatusController = async (req, res) => {
    const start = Date.now();
    
    // Check for payload
    if (req.method === 'GET' && ((req.headers['content-length'] > 0) || Object.keys(req.query).length > 0)) {
        res.set('Cache-Control', 'no-cache'); // No caching
        await logHealthCheckMetrics('RequestInvalid', start);
        return res.status(400).send(); // 400 Bad Request
    }

    if (req.method !== 'GET') {
        await logHealthCheckMetrics('RequestMethodNotAllowed', start);
        return res.status(405).send(); // For any request other than GET
    }

    try {
        await healthcheckService.checkDBConnection(); // Ensure DB is connected
        res.set('Cache-Control', 'no-cache'); // No caching
        await logHealthCheckMetrics('DBConnectionSuccessful', start);
        return res.status(200).send(); // 200 OK
    } catch (error) {
        console.error('Database connection failed:', error);
        res.set('Cache-Control', 'no-cache'); // No caching
        await logHealthCheckMetrics('DBConnectionFailed', start);
        return res.status(503).send(); // 503 Service Unavailable
    }
};

const logHealthCheckMetrics = async (metricName, start) => {
    const duration = Date.now() - start;
    
    await cloudwatch.putMetricData({
        MetricData: [
            {
                MetricName: metricName,
                Unit: 'Count',
                Value: 1,
            },
            {
                MetricName: 'HealthCheckDuration',
                Unit: 'Milliseconds',
                Value: duration,
            },
        ],
        Namespace: 'webapp', // Change this to your app's namespace
    }).promise();
};

module.exports = getStatusController;
