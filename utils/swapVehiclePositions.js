
/**
 * Created by ben on 03/06/2016.
 */

var config = require('../config/config');
var mongoose    =   require("mongoose");

var fs = require('fs');
let async = require("async");


var publicModels  =   fs.readdirSync("../api/models-public");
var privateModels  =   fs.readdirSync("../api/models-private");

var pModels      =   {};
var privModels      =   {};
// Base de Datos
let connString = 'mongodb://'+config.db.apiDbHost+':'+config.db.apiDbPort+'/'+config.db.apiDbName;
mongoose.connect(connString);
console.log(connString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connected to MongoDB | ", connString);
});


// Extracción de los modelos existentes.
publicModels.forEach(function(val){
    val = val.replace('.js','');
    // console.log("Public Model [" + val + "] Added");
    pModels[val] = require('../api/models-public/' + val)(mongoose, db);
});

privateModels.forEach(function(val){
    val = val.replace('.js','');
    // console.log("Private Model [" + val + "] Added");
    privModels[val] = require('../api/models-private/' + val)(mongoose, db);
});

let positionsModel = db.model('positions');
positionsModel.find({
        deviceId: '58b200b089b6062a04107998',
        createdAt: {$gt: new Date(2017, 4, 19), $lt: new Date(2017, 4, 20)}
    },
    function (err, positions) {
        console.log(positions.length);
        let functions = [];
        positions.forEach(p => {
            functions.push(cb => {
                p._deviceId = p.deviceId;
                p._vehicleId = p.vehicleId;
                p.deviceId = "5920776b145142efeae8a93d";
                p.vehicleId = "59207826ff831408eb0e0ee8";
                p.save(cb);
            })
        });
        async.parallel(functions, function (err) {
            if (err) console.warn(err);
            else console.log("done");
        });
    });