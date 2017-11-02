'use strict';
var data;
var fs;
data = require(`${__dirname}/../data`);
fs = require('fs');

module.exports = function(service = null){
    return new Promise(function(resolve, reject){
        var self = service;

        /*Connects to any database found in config.db (name of db config)*/
        self.connectors = new data.Connector(self.config.db);

        self.logger.info('Connectors created for', self.config.db);

        let promises = [];
        Object.keys(self.connectors.connectors).forEach((conn)=>{
            promises.push(self.connectors.connectors[conn].connect());
        });

        Promise.all(promises)
            .then(() => {
                self.logger.info('Service connected to all databases');
                /*Prepares all models existing in folder models... with extension of name sql / mongodb */
                data.Models.prepare(self.connectors.connectors, self)
                    .then((models) => {
                        self.dataConnectors = {};
                        Object.keys(self.connectors.connectors).forEach((connId)=> {
                            self.dataConnectors[connId] = self.connectors.connectors[connId].getConnection();
                        });
                        self.logger.info('Models are prepared and ready to be used');
                        Object.keys(models).forEach((dbName)=>{
                            self.logger.debug(`${dbName} available models`);
                            self.logger.debug(`-- ${dbName}`);
                            Object.keys(models[dbName]).forEach((modelName)=>{
                                self.logger.debug(`-- -- ${dbName}.${modelName}`);
                            })
                        });
                        self.models = models;
                        self.setHttpControllers();
                        self.setIo();

                        if (self.config.directories.webApp) {
                            let stat = fs.lstatSync(self.config.directories.webApp);
                            if (stat.isDirectory()){
                                try{
                                    let webApp = require(self.config.directories.webApp);

                                    self.logger.info('Using external web services for WebApp');

                                    if (webApp.use){
                                        webApp.use(self);
                                    }else{
                                        webApp(self);
                                    }
                                    resolve();
                                }catch(err){
                                    self.app.use(`/${self.config.host.webServerRoute}`, express.static(self.config.directories.webApp));
                                    self.logger.info(`Adding static routes for ${self.config.directories.webApp}`);
                                    resolve();
                                }
                            }
                        }
                    })
                    .catch((err)=>{
                        self.logger.error(err);
                        reject(err);
                    });
            })
            .catch((err)=>{
                self.logger.error(err);
                reject(err);
            });
    });

};