const express = require('express');
const RateLimit = require('express-rate-limit');

const tutikEndpoints = require('./routes/tutik');
const tutiEndpoints = require('./routes/tuti');


exports.getApp = getApp;
async function getApp() {
    const app = express();

    const standardLimiter = new RateLimit({
        windowMs: 60000,
        delayAfter: 0,
        max: 100,
    });

    app.use('/tutik', standardLimiter, tutikEndpoints);
    app.use('/tuti', standardLimiter, tutiEndpoints);

    return app;
}
