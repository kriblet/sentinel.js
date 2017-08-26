/**
 * Created by Ben on 26/05/2017.
 */

'use strict';

const ConnectorTypes = require(__dirname + '/../connector/common/ConnectorTypes'),
    async = require("async"),
    _ = require("lodash");

/**
 * Prepares all the models in the module, depending on each connector registered.
 * it may be 2 of them actually, an sql connector and mongodb connector.
 * @param connectors
 * @returns {Promise}
 */
module.exports.prepare = (connectors, service)=>{
    return new Promise((resolve, reject)=>{
        let models = {};
        /**
         * connector iteration to find out from where to take the models.
         */
        async.eachSeries(Object.keys(connectors), (connectorName, cb)=>{
            let connector = connectors[connectorName];
            switch (connector.type){
                case ConnectorTypes.sql:
                    require(__dirname + '/sql')(connector, service, (result)=>{
                        models = _.merge(models, result);
                        cb();
                    });
                    break;
                case ConnectorTypes.mongodb:
                    require(__dirname + '/mongodb')(connector, service, (result)=> {
                        models = _.merge(models, result);
                        cb();
                    });
                    break;
                case ConnectorTypes.dynamodb:
                    require(__dirname + '/dynamodb')(connector, service, (result)=> {
                        models = _.merge(models, result);
                        cb();
                    });
                    break;
                default:
                    cb(new Error("Not implemented"));
            }
        },(err)=>{
            if(err){
                reject(err);
            }else{
                resolve(models);
            }
        });

    });
};