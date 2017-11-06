/* config handler */
let local = null;
try {
    local = require(__dirname + '/local');
}catch(err){}

/* we will always need 2 configurations to be loaded. production and development, we don't need more. */
/* the local configuration always override development configuration */
module.exports.development  = local || require(__dirname + '/development');
module.exports.production   = require(__dirname + '/production');
