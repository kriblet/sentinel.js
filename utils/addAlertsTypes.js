/**
 * Created by edgardo on 11/17/16.
 */

var config = require('../config/config');
var mongoose = require("mongoose");
var async = require("async");

var fs = require('fs');

var publicModels = fs.readdirSync("../api/models-public");
var privateModels = fs.readdirSync("../api/models-private");

var pModels = {};
var privModels = {};
// Base de Datos
mongoose.connect('mongodb://'+config.db.apiDbHost+':'+config.db.apiDbPort+'/'+config.db.apiDbName);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connected to MongoDB");
});


// Extracción de los modelos existentes.
publicModels.forEach(function (val) {
    val = val.replace('.js','');
    console.log("Public Model [" + val + "] Added");
    pModels[val] = require('../api/models-public/' + val)(mongoose, db);
});

privateModels.forEach(function (val) {
    val = val.replace('.js','');
    console.log("Private Model [" + val + "] Added");
    privModels[val] = require('../api/models-private/' + val)(mongoose, db);
});

var alertsTypesModel = db.model('alertsTypes');
var geoFences = new alertsTypesModel({
        name: "geoFences",
        properties: [{
            name: "geoFence",
            typeOf: "Model",
            reference: "geoFences",
            isRequired: true
        }, {
            name: "in/out",
            typeOf: "Boolean",
            reference: "true/false",
            isRequired: true
        }],
        related: [],
        createdAt: new Date()
    });

var velocity = new alertsTypesModel({
        name: "velocity",
        properties: [{
            name: "max",
            typeOf: "Number",
            reference: "kms",
            isRequired: true
        }, {
            name: "min",
            typeOf: "Number",
            reference: "kms",
            isRequired: false
        }],
        related: [],
        createdAt: new Date()
    });

var engine = new alertsTypesModel({
        name: "engine",
        properties: [{
            name: "on/off",
            typeOf: "Boolean",
            reference: "true/false",
            isRequired: true
        }],
        related: [],
        createdAt: new Date()
    });

var activity = new alertsTypesModel({
        name: "activity",
        properties: [{
            name: "on/off",
            typeOf: "Boolean",
            reference: "true/false",
            isRequired: true
        }],
        related: [],
        createdAt: new Date(),
        visibility: 0
    });

var fuel = new alertsTypesModel({
        name: "fuel",
        properties: [{
            name: "min",
            typeOf: "Number",
            reference: "lts"
        }],
        related: [],
        createdAt: new Date(),
        visibility: 0
    });

var temperature = new alertsTypesModel({
        name: "temperature",
        properties: [{
            name: "max",
            typeOf: "Number",
            reference: "degrees",
            isRequired: true
        }, {
            name: "min",
            typeOf: "Number",
            reference: "degrees",
            isRequired: false
        }],
        related: [],
        createdAt: new Date(),
        visibility: 0
    });

async.eachSeries([geoFences, velocity, activity, engine, fuel, temperature],
    function (alert, callback) {
        alert.save(function (err) {
            console.log(alert._id);
            callback(err);
        });
    }, function (err) {
        if (err) {
            console.warn(err);
        } else {
           geoFences.related = [velocity._id, activity._id, engine._id];
           velocity.related = [geoFences._id];
           activity.related = [geoFences._id];

           alertsTypesModel.findOneAndUpdate({_id: geoFences._id}, geoFences, function (err) {
               if (err) console.warn(err);
           });
            alertsTypesModel.findOneAndUpdate({_id: velocity._id}, velocity, function (err) {
                if (err) console.warn(err);
            });
            alertsTypesModel.findOneAndUpdate({_id: activity._id}, activity, function (err) {
                if (err) console.warn(err);
            });
        }
    });
