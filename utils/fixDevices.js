
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

let countUserVehicles = function () {
    users.find(null,(err, u)=>{
        u.forEach(function (val) {
            vehicles.count({userId:val._id},(err,v)=>{
                if(v > 0){
                    console.log(val.username);
                    console.log(v);
                }
            });
        });
    });

};

let getAlerts = function () {
    positions.find({alertId:{$ne:null}},(err,p)=>{
        p.forEach(function (val, i) {
            vehicles.find({deviceId:val.deviceId},(err,v)=>{
                v.forEach(function (vehicle,i) {
                    console.log(vehicle.alias, val.createdAt, val.alertId);
                })
            });
        });
    });
};

let fix = function() {

    let failedImeis =
        [6681252200];

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
                                d.active = true;
                                d.attached = false;
                                d.visibility = 3;
                                d.save(function (err) {
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

let core = function () {
    let devicesFilter = {$or:[]};
    devicesFilter.$or.push({imei:6417303959});

    let vehiclesFilter = {$or:[]};


    devices.find(devicesFilter,(err,dvs)=>{
        let funcs = [];
        dvs.forEach((d)=>{
            console.log("device", d._id);
            vehiclesFilter.$or.push({deviceId:d._id});
            console.log("filter", vehiclesFilter);
            vehicles.find(vehiclesFilter, (err, v)=>{
                if(v.length == 0){
                    /* dvs.forEach((d)=>{
                     funcs.push((cb)=>{
                     d.active = true;
                     d.attached = false;
                     d.save(function (err) {
                     cb(err);
                     });
                     })
                     });

                     async.parallel(funcs, function (err) {
                     if(!err)
                     console.log("done");
                     });*/
                }else{
                    console.log("vehicle assigned")
                }
            });
        });

    });
    /*
     let funcs = [];
     dvs.forEach((d)=>{
     funcs.push((cb)=>{
     d.active = false;
     d.attached = false;
     d.save(function (err) {
     cb(err);
     });
     })
     });
     async.parallel(funcs, function (err) {
     if(!err)
     console.log("done");
     });
     */
};


let getLastEngine = function () {
    let devicesFilter = {$or:[]};
    devicesFilter.$or.push({phone:6871925069});

    let vehiclesFilter = {$or:[]};


    devices.find(devicesFilter,(err,dvs)=> {
        dvs.forEach((d) => {
            console.log("device", d._id);
            vehiclesFilter.$or.push({deviceId: d._id});
            console.log("filter", vehiclesFilter);
            vehicles.find(vehiclesFilter, (err, v) => {
                if (v.length == 0) {
                    console.log(v);
                } else {
                    console.log(v);
                    let vehicle = v[0];

                    let positionsQuery = {
                        $and:[
                            {vehicleId: vehicle._id},
                            {$or:[{accState: 0}]}
                        ]
                    };


                    positions.find(positionsQuery).limit(1).sort('createdAt').exec(function (err, position) {
                        if(!err){
                            console.log(position)
                        }else{
                            console.error(err)
                        }
                    })
                }
            });
        });
    });
};

//getLastEngine();
fix();
//getAlerts();