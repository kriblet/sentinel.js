/**
 * Created by hexenon on 27/01/17.
 */


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

var deviceCommandsModel = db.model('deviceCommands');
var newDeviceCommands = new deviceCommandsModel({
    name: "Shut Down",
    function: "shutDown",
    validates: [{adapter:"TK103", expects:"109"}],
    active: true,
    created_at : new Date()
});

newDeviceCommands.save(function(err){
    if (!err){
        console.log('Saved Shut Down command')
    }
});
var newDeviceCommands2 = new deviceCommandsModel({
    name: "Turn On",
    function: "turnOn",
    validates: [{adapter:"TK103", expects:"110"}],
    active: true,
    created_at : new Date()
});
newDeviceCommands2.save(function(err){
    if (!err){
        console.log('Saved Turn On command')
    }
});

//--imei 6215501868

var deviceMessagesModel = db.model('deviceMessages');
let devices = db.model('devices');
let vehicles = db.model('vehicles');
devices.findOne({imei:'359710046031556'},function(err,device){
    vehicles.findOne({deviceId:device._id},function(err, vehicle){
        var turnOff = new deviceMessagesModel({
            vehicle : vehicle._id,
            command: "588bf6e04968277ba9cab0a6", // 588bf6e04968277ba9cab0a6 shutdown 588bf6e04968277ba9cab0a8 turnon
            user : "5841fa4d129de87a2fd567dc" // 5841fa4d129de87a2fd567dc hexenon
        });
        turnOff.save(function(err){console.log(err ? 'Error. ' + err.toString() : 'Command SENT');});
    })
});



