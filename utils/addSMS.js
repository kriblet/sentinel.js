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

var smsModel = db.model('sms');
var sms = {};
for (var i=0; i<=0; i++){
    sms[i] = new smsModel({
        from: 'Xentinel',
        to: '526681483586',
        text: 'Test number ' + i
    });

    sms[i].save(function(err){
        if (!err){
            console.log(i,'Saved')
        }
    });
}