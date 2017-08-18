
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


let positions = db.model('positions');

let fix = function() {
    positions.find({},function (err, vs) {
        let devicesFilter = {$or:[]};
        vs.forEach((v)=>{
            devicesFilter.$or.push({_id:v.deviceId});
        });

        devices.find(devicesFilter,(err,dvs)=>{
            let funcs = [];
            dvs.forEach((d)=>{
                funcs.push((cb)=>{
                    d.active = true;
                    d.attached = true;
                    d.save(function (err) {
                        cb(err);
                    });
                })
            });
            async.parallel(funcs, function (err) {
                console.log("done");
            });
        });


    });
};
fix();