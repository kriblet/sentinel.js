/**
 * Created by Ben on 29/05/2017.
 */

'use strict';

const fs = require("fs"),
    mongoose = require("mongoose");

/**
 * returns all models for mongodb connection
 * @param mongodbConnector
 * @param service
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
                let model = require(`${_directory}/${modelName}`)(mongodbConnector.getConnection(), mongoose, service);
                models[modelName.replace(".js","")] = model.model;
                models[modelName.replace(".js","")].isPublic = model.public;

            }
        });
        if (service.config.directories.models && service.config.directories.models.mongodb){
            service.config.directories.models.mongodb.forEach((customRoute)=>{
                let customModels = fs.readdirSync(customRoute);
                customModels.forEach((customModelName)=>{
                    let model = require(`${customRoute}/${customModelName}`)(mongodbConnector.getConnection(), mongoose, service);
                    models[customModelName.replace(".js","")] = model.model;
                    models[customModelName.replace(".js","")].isPublic = model.public;
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
                        let model = require(`${_directory}/${modelName}`)(mongodbConnector.getConnection(), mongoose, service);
                        models[modelName.replace(".js","")] = model.model;
                        models[modelName.replace(".js","")].isPublic = model.public;
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