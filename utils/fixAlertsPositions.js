/**
 * Created by edgardo on 20/02/17.
 */

let config = require('../config/config');
let mongoose = require("mongoose");
let async = require("async");

mongoose.Promise = global.Promise;

let fs = require('fs');

let publicModelsFiles = fs.readdirSync("../api/models-public");
let privateModelsFiles = fs.readdirSync("../api/models-private");

let publicModels = {};
let privateModels = {};
// Base de Datos
let conn = `mongodb://${config.db.apiDbHost}:${config.db.apiDbPort}/${config.db.apiDbName}`;
console.log(conn);
mongoose.connect(conn);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log(`Connected to MongoDB || ${conn}`);
});

// Extracción de los modelos existentes.
publicModelsFiles.forEach(function (val) {
    val = val.replace('.js','');
    console.log(`Public Model [${val}] Added`);
    publicModels[val] = require('../api/models-public/' + val)(mongoose, db);
});

privateModelsFiles.forEach(function (val) {
    val = val.replace('.js','');
    console.log(`Private Model [${val}] Added`);
    privateModels[val] = require('../api/models-private/' + val)(mongoose, db);
});

let alertsTriggeredModel = db.model('alertsTriggered');
let positionsModel = db.model('positions');

alertsTriggeredModel.find({}, function (error, alerts) {
   if (error) {
       console.warn(error);
   } else {
       console.log(alerts);
       alerts.forEach(function (alert) {
           positionsModel.findOneAndUpdate(
               {_id: alert.position},
               {alertId: alert._id},
               function (error, old) {
                   if (error) {
                       console.warn(error);
                   } else {
                       console.log(old);
                   }
               });
       });

   }
});
