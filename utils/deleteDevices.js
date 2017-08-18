
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
mongoose.connect('mongodb://'+config.db.apiDbHost+':'+config.db.apiDbPort+'/'+config.db.apiDbName);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connected to MongoDB");
});


// Extracción de los modelos existentes.
publicModels.forEach(function(val){
    val = val.replace('.js','');
    console.log("Public Model [" + val + "] Added");
    pModels[val] = require('../api/models-public/' + val)(mongoose, db);
});

privateModels.forEach(function(val){
    val = val.replace('.js','');
    console.log("Private Model [" + val + "] Added");
    privModels[val] = require('../api/models-private/' + val)(mongoose, db);
});

let vehicles = db.model('vehicles');
let devices = db.model('devices');
let positions = db.model('positions');
let users = db.model('users');

let deleteDevices = function() {

    let failedImeis =
        [6681370635];

    failedImeis.forEach(function (imei) {
        let devicesFilter = {$or:[]};
        devicesFilter.$or.push({phone:imei});

        let vehiclesFilter = {$or:[]};

        devices.find(devicesFilter,(err,dvs)=>{
            let funcs = [];
            dvs.forEach((d)=>{
                console.log("device", d._id);
                vehiclesFilter.$or.push({deviceId:d._id});
                console.log("filter", vehiclesFilter);
                vehicles.find(vehiclesFilter, (err, v)=>{

                    if(v.length == 0){
                        dvs.forEach((d)=>{
                            funcs.push((cb)=>{
                                devices.findOneAndUpdate({_id:d._id}, {$ser:{active:false, atached:false, visibility:3}}, function (err) {
                                    cb(err);
                                });
                            })
                        });

                        async.parallel(funcs, function (err) {
                            if(!err)
                                console.log("done");
                        });
                    }else{
                        console.log("vehicle assigned")
                    }
                });
            });

        });
    });
};

deleteDevices();