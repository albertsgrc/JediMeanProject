var winston = require('winston');

exports.JWT_SECRET = "vyciyxzra45rsdygrttttvfffrfcccccc";

exports.DB_URI = 'mongodb://localhost/contactagenda';

exports.WINSTON_OPTIONS = {
    transports: [
        new winston.transports.Console({
            colorize: true
        })
    ],
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    colorStatus: true
};

exports.APP_PORT = 8080;