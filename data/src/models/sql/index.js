/**
 * Created by Ben on 29/05/2017.
 */
'use strict';

const fs = require("fs"),
    Sequelize = require("sequelize");


/**
 * exports each model for sql connection
 * @param sqlConnector
 * @param callback
 */
module.exports = (sqlConnector, service, callback)=>{

    let _directory = __dirname,
        objectName = null;

    try {
        /**
         * checks if the path to the models matches the name of the connection
         * in that case the models are specific to the connection
         */
        if (fs.lstatSync(`${__dirname}/${sqlConnector.name}`).isDirectory()) {
            _directory = `${__dirname}/${sqlConnector.name}`;
            objectName = sqlConnector.name;
        }
    }catch(err){
    }

    fs.readdir(`${__dirname}`, (err, sqlModels)=>{
        let models = {};
        sqlModels.forEach((modelName)=>{
            if (modelName !== "index.js" && modelName.indexOf(".js") > -1){
                /**
                 * creates each model instance
                 */
                models[modelName.replace(".js","")] = require(`${__dirname}/${modelName}`)(sqlConnector.getConnection(), Sequelize.DataTypes);
            }
        });

        let response = {};
        response.sql = models;
        /**
         * checks if there is connection specific models.
         */
        if (objectName){
            fs.readdir(`${_directory }`, (err, sqlModels)=>{
                let models = {};
                sqlModels.forEach((modelName)=>{
                    if (modelName !== "index.js" && modelName.indexOf(".js") > -1){
                        /**
                         * creates each model instance
                         */
                        models[modelName.replace(".js","")] = require(`${_directory}/${modelName}`)(sqlConnector.getConnection(), Sequelize.DataTypes);
                    }
                });
                response[objectName] = models;
                callback(response);
            });
        }else{
            callback(response);
        }
    });
};