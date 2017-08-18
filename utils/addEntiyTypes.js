/**
 * Created by edgardo on 2/3/17.
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
mongoose.connect(`mongodb://${config.db.apiDbHost}:${config.db.apiDbPort}/${config.db.apiDbName}`);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB");
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

let entityTypesModel = db.model('entityTypes');
let types = ["vehicle", "truck", "machinery", "trailer", "van", "person", "dog", "cat"];

async.eachSeries(types, function (type, callback) {
    let entityType = new entityTypesModel({
        name: type
    });
    entityType.save(function (err) {
        console.log(`Entity saved: ${entityType._id}`);
        callback(err);
    });
}, function (err) {
    if (err) {
        console.warn(err);
    } else {
        console.log('All entity types saved');
    }
});