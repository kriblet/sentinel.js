/**
 * Created by Ben on 29/05/2017.
 */

'use strict';

const fs = require("fs"),
    mongoose = require("mongoose");

/**
 * returns all models for mongodb connection
 * @param mongodbConnector
 * @param callback
 */
module.exports = (mongodbConnector, service, callback)=>{
    let _directory = __dirname,
        objectName = null;

    try {
        /**
         * checks if the path to the models matches the name of the connection
         * in that case the models are specific to the connection
         */
        if (fs.lstatSync(`${__dirname}/${mongodbConnector.name}`).isDirectory()) {
            _directory = `${__dirname}/${mongodbConnector.name}`;
            objectName = mongodbConnector.name;
        }
    }catch(err){
    }

    fs.readdir(`${__dirname}`, (err, mongodbModels)=>{
        let models = {};
        mongodbModels.forEach((modelName)=>{
            if (modelName !== "index.js" && modelName.indexOf(".js") > -1){
                /**
                 * creates each model instance
                 */
                models[modelName.replace(".js","")] = require(`${__dirname}/${modelName}`)(mongodbConnector.getConnection(), mongoose, service);
            }
        });
        if (service.config.directories.models && service.config.directories.models.mongodb){
            service.config.directories.models.mongodb.forEach((customRoute)=>{
                let customModels = fs.readdirSync(customRoute);
                customModels.forEach((customModelName)=>{
                    models[customModelName.replace(".js","")] = require(`${customRoute}/${customModelName}`)(mongodbConnector.getConnection(), mongoose, service);
                })
            })
        }

        let response = {};
        response.mongodb = models;
        /**
         * checks if there is connection specific models.
         */
        if (objectName){
            fs.readdir(`${_directory }`, (err, mongodbModels)=>{
                let models = {};
                mongodbModels.forEach((modelName)=>{
                    if (modelName !== "index.js" && modelName.indexOf(".js") > -1){
                        /**
                         * creates each model instance
                         */
                        models[modelName.replace(".js","")] = require(`${_directory}/${modelName}`)(mongodbConnector.getConnection(), mongoose, service);
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