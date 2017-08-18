/**
 * Created by Ben on 29/05/2017.
 */

'use strict';

const fs = require("fs"),
    dynamoose = require("dynamoose");

/**
 * returns all models for dynamodb connection
 * @param dynamodbConnector
 * @param callback
 */
module.exports = (dynamodbConnector, service, callback)=>{
    let _directory = __dirname,
        objectName = null;

    try {
        /**
         * checks if the path to the models matches the name of the connection
         * in that case the models are specific to the connection
         */
        if (fs.lstatSync(`${__dirname}/${dynamodbConnector.name}`).isDirectory()) {
            _directory = `${__dirname}/${dynamodbConnector.name}`;
            objectName = dynamodbConnector.name;
        }
    }catch(err){
    }

    fs.readdir(`${__dirname}`, (err, dynamodbModels)=>{
        let models = {};
        dynamodbModels.forEach((modelName)=>{
            if (modelName !== "index.js" && modelName.indexOf(".js") > -1){
                /**
                 * creates each model instance
                 */
                models[modelName.replace(".js","")] = require(`${__dirname}/${modelName}`)(dynamodbConnector.getConnection(), dynamoose);
            }
        });

        let response = {};
        response.mongodb = models;
        /**
         * checks if there is connection specific models.
         */
        if (objectName){
            fs.readdir(`${_directory }`, (err, dynamodbModels)=>{
                let models = {};
                dynamodbModels.forEach((modelName)=>{
                    if (modelName !== "index.js" && modelName.indexOf(".js") > -1){
                        /**
                         * creates each model instance
                         */
                        models[modelName.replace(".js","")] = require(`${_directory}/${modelName}`)(dynamodbConnector.getConnection(), dynamoose);
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