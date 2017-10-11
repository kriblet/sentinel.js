const express = require('express');
module.exports = function(self){
    self.app.use(`/${self.config.host.webServerRoute}`, express.static(`${__dirname}/web`));
    self.logger.info(`Adding static routes for ${self.config.directories.webApp}`);
};