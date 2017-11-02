'use strict';
var Security;


Security = require(`${__dirname}/../security`);


module.exports = function(service = null){
    var self = service;

    if (self.config.security.disableFrameEmbedding){
        self.logger.info('Security :: Disabling frame embedding');
    }
    if (self.config.security.disableMimeSniffing){
        self.logger.info('Security :: Disabling mime sniffing');
    }
    if (self.config.security.enableXssFilter){
        self.logger.info('Security :: Enabling XSS filter');
    }
    if (self.config.security.disableIeCompatibility){
        self.logger.info('Security :: Disabling IE compatibility');
    }

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