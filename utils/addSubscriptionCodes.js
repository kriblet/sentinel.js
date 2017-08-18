/**
 * Created by edgardo on 11/17/16.
 */

const config = require('../config/config');
const mongoose = require("mongoose");
const async = require("async");

const fs = require('fs');

const publicModelsFiles = fs.readdirSync("../api/models-public");
const privateModelsFiles = fs.readdirSync("../api/models-private");

let publicModels = {};
let privateModels = {};
// Database
mongoose.connect('mongodb://'+config.db.apiDbHost+':'+config.db.apiDbPort+'/'+config.db.apiDbName);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB |", 'mongodb://'+config.db.apiDbHost+':'+config.db.apiDbPort+'/'+config.db.apiDbName);
});

const subscriptionUtils = require('../api/utils/subscriptionUtils')(mongoose, db);

// Extracción de los modelos existentes.
publicModelsFiles.forEach(function (val) {
    val = val.replace('.js','');
    console.log("Public Model [" + val + "] Added");
    publicModels[val] = require('../api/models-public/' + val)(mongoose, db);
});

privateModelsFiles.forEach(function (val) {
    val = val.replace('.js','');
    console.log("Private Model [" + val + "] Added");
    privateModels[val] = require('../api/models-private/' + val)(mongoose, db);
});

let subscriptionCodesModel = db.model('subscriptionCodes');
let generateAllCodes = function (name, pointer) {
    return new Promise(function (resolve, reject) {
        let model = db.model(name);
        model.find({}, function (err, docs) {
            if (err) {
                console.warn(err);
            } else {
                console.log(name,':', docs.length);
                async.eachSeries(docs, function (doc, callback) {
                    let query = {};
                    query[pointer] = doc._id;
                    subscriptionCodesModel.findOne(query, function (err, sub) {
                        if (err) {
                            callback(err);
                        } else {
                            if (sub) {
                                console.log(sub);
                                callback();
                            } else {
                                subscriptionUtils.generateCode(query)
                                    .then(function (sub) {
                                        console.log(sub);
                                        callback();
                                    })
                                    .catch(function (err) {
                                        callback(err);
                                    })
                            }
                        }
                    });
                }, function (error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    });
};

generateAllCodes('users', 'userId')
    .then(function () {
       return generateAllCodes('alertsConfigs', 'alertsConfigId');
    })
    .then(function () {
        console.log('All codes generated');
    })
    .catch(function (error) {
        console.warn(error);
    });


