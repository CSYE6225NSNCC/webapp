// metricsLogger.js
const AWS = require('aws-sdk');

const cloudwatch = new AWS.CloudWatch();

const logMetrics = async (req, res, next) => {
    const start = Date.now();

    res.on('finish', async () => {
        const duration = Date.now() - start;

        // Count the API call
        await cloudwatch.putMetricData({
            MetricData: [{
                MetricName: 'ApiCallCount',
                Dimensions: [{ Name: 'ApiName', Value: req.originalUrl }],
                Unit: 'Count',
                Value: 1,
            }, {
                MetricName: 'ApiCallDuration',
                Dimensions: [{ Name: 'ApiName', Value: req.originalUrl }],
                Unit: 'Milliseconds',
                Value: duration,
            }],
            Namespace: 'webapp'
        }).promise();
    });

    next();
};

module.exports = logMetrics;
