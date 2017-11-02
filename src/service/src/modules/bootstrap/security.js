'use strict';
var Security;


Security = require(`${__dirname}/../security`);


module.exports = function(service = null){
    var self = service;

    /* Set default headers for express api app */
    self.app.use(function (req, res, next) {
        res.header('X-Powered-By', "SentinelJs");
        if (self.config.security.disableFrameEmbedding){
            Security.disableFrameEmbedding(res);
        }
        if (self.config.security.disableMimeSniffing){
            Security.disableMimeSniffing(res);
        }
        if (self.config.security.enableXssFilter){
            Security.enableXssFilter(res);
        }
        if (self.config.security.disableIeCompatibility){
            Security.disableIeCompatibility(res);
        }
        next();
    });

};