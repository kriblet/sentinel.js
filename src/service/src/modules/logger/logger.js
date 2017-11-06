'use strict';

const winston = require('winston');
winston.emitErrs = true;

/* set up winston log levels and transports */
let logger = new (winston.Logger)({
    levels: {
        'error': 0,
        'warn': 1,
        'info': 2,
        'debug': 3,
    },
    colors: {
        'debug': 'gray',
        'info': 'cyan',
        'warn': 'yellow',
        'error': 'red'
    },
    transports: [
        new (winston.transports.Console)({
            colorized: true,
            timestamp: true
        }),
        new (winston.transports.File)({
            filename: 'sentinel.log'
        })
    ]
});

/* attaches the application to the logger, logs any incoming request */
logger.attach = function(service){
    service.app.use(function(req, res, next){
        logger.debug(req.method, req.url);
        if (Object.keys(req.query) > 0){
            logger.debug('query', req.query);
        }
        if (Object.keys(req.params) > 0) {
            logger.debug('params', req.params);
        }
        if (req.body){
            logger.debug('body', req.body);
        }
        next();
    });
};


module.exports = logger;

