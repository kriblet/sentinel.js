/**
 * Created by duan on 01/06/2017.
 */
var config = require('../config/config');
let vinGenerator = require('./vinGenerator');
let fs = require('fs');
let utf8 = require('utf8');
let mongoose = require("mongoose");
let conn =  mongoose.createConnection('mongodb://'+config.db.apiDbHost+':'+config.db.apiDbPort+'/'+config.db.apiDbName);
let devicesModel = require("../api/models-public/devices")(mongoose,conn).model;

fs.readFile('./files/devices.json', function(err,content){
    let devices = JSON.parse(content);
    let devicesOr = [];
    devices.forEach(function(device){
        if(device.imei){
            devicesOr.push({imei: device.imei})
        }
    });

    let devicesFilter = {
        $or:devicesOr
    };


    devicesModel.find(devicesFilter).exec(function (err, devices) {
        console.log(devices.length);
    });
});
