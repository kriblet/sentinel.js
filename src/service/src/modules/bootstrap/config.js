'use strict';
var compression,
    bodyParser;

compression = require('compression');
bodyParser = require("body-parser");

module.exports = function(service = null, config = null){
    let self = service;

    if (!service){
        throw new Error("Service Application is not set");
    }
    if (!config){
        throw new Error("Configuration is not set for Service Application");
    }

    self.config = config;
    self.logger.level = self.config.logLevel;
    self.logger.info('Adding configuration');

    /* Express api app configuration*/
    self.app.use( compression()) ;
    self.app.use( bodyParser.json() );
    self.app.use( bodyParser.urlencoded({"extended": false}) );

};