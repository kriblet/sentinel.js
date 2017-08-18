
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
let _filter = {vehicleId:"58c8325dcfd976a9056202f1"};


positions.count(_filter)
    .then((totalCount)=>{
    console.log("FOUND TO FIX ",totalCount);
        let fixedCount = 0;
        let threshold = 1000;
        let fix = function() {
            positions.find(_filter).skip(fixedCount).limit(threshold).exec(function (err, pos) {
                console.log("Fixing ", pos.length);
                let count = 0;
                let funcs = [];

                pos.forEach((p)=>{
                    funcs.push((cb)=>{
                        p.date = p.createdAt;
                        p.time = p.date.getTime() / 1000;
                        p.save(function (err) {
                            count++;
                            if (!err) {
                                console.log("Fixed",fixedCount,count);
                                console.log("total: ",(((fixedCount+count) / totalCount) * 100).toFixed(2), "%");
                            }
                            cb(err);
                        });
                    })
                });
                async.parallel(funcs, function (err) {
                    fixedCount += threshold;
                    fix();
                });

            });
        };
        fix();
    }).catch((err)=>{
        console.error(err);
});
