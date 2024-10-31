// metricsLogger.js
const AWS = require('aws-sdk');

const cloudwatch = new AWS.CloudWatch();

const logMetrics = async (req, res, next) => {
    const start = Date.now();

    res.on('finish', async () => {
        const duration = Date.now() - start; // Calculate duration
        const statusCode = res.statusCode;

        // Send metrics to CloudWatch
        await cloudwatch.putMetricData({
            MetricData: [
                {
                    MetricName: 'RequestCount',
                    Dimensions: [
                        { Name: 'Endpoint', Value: req.originalUrl },
                        { Name: 'Method', Value: req.method }
                    ],
                    Unit: 'Count',
                    Value: 1
                },
                {
                    MetricName: 'ResponseTime',
                    Dimensions: [
                        { Name: 'Endpoint', Value: req.originalUrl },
                        { Name: 'Method', Value: req.method }
                    ],
                    Unit: 'Milliseconds',
                    Value: duration
                },
                {
                    MetricName: '4xxErrors',
                    Dimensions: [
                        { Name: 'Endpoint', Value: req.originalUrl },
                        { Name: 'Method', Value: req.method }
                    ],
                    Unit: 'Count',
                    Value: statusCode >= 400 && statusCode < 500 ? 1 : 0
                },
                {
                    MetricName: '5xxErrors',
                    Dimensions: [
                        { Name: 'Endpoint', Value: req.originalUrl },
                        { Name: 'Method', Value: req.method }
                    ],
                    Unit: 'Count',
                    Value: statusCode >= 500 ? 1 : 0
                }
            ],
            Namespace: 'webapp' // Change this to your app's namespace
        }).promise();
    });

    next();
};

module.exports = logMetrics;
