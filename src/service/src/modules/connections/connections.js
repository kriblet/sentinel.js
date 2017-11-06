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
                        self.connections = {};
                        Object.keys(self.connectors.connectors).forEach((connId)=> {
                            self.logger.info(`Connection ${connId} ready and attached to Service`);
                            self.connections[connId] = self.connectors.connectors[connId].getConnection();
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

                        process.nextTick(resolve);
                    })
                    .catch((err)=>{
                        process.nextTick(()=>{
                            self.logger.error(err);
                            reject(err);
                        });
                    });
            })
            .catch((err)=>{
                process.nextTick(()=>{
                    self.logger.error(err);
                    reject(err);
                });reject(err);
            });
    });

};