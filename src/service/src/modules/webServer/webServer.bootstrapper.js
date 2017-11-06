'use strict';

module.exports = function(service){
    let self = service;

    return new Promise((resolve)=>{
        if (self.config.webServer.path) {
            let stat = fs.lstatSync(self.config.webServer.path);
            if (stat.isDirectory()){
                try{
                    let webApp = require(self.config.webServer.path);
                    self.logger.info('Using external web services for WebApp');
                    if (webApp.use){
                        webApp.use(self);
                    }else{
                        webApp(self);
                    }
                    process.nextTick(resolve);
                }catch(err){
                    self.app.use(`/${self.config.webServer.route}`, express.static(self.config.webServer.path));
                    self.logger.info(`Adding static routes for ${self.config.webServer.path}`);
                    process.nextTick(resolve);
                }
            }
        }else{
            process.nextTick(resolve);
        }
    });

};