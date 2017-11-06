'use strict';


module.exports.config = require(__dirname + '/config');
module.exports.connections = require(__dirname + '/../connections');
module.exports.security = require(__dirname + '/../security').bootstrapper;

module.exports.webServer = require(__dirname + '/../webServer');

module.exports.plugins = require(`${__dirname}/../plugins`);

