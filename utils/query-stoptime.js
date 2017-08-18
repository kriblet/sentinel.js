
/**
 * Created by ben on 03/06/2016.
 */

let config = require('../config/config');
let mongoose    =   require("mongoose");

let fs = require('fs');

let publicModels  =   fs.readdirSync("../api/models-public");
let privateModels  =   fs.readdirSync("../api/models-private");

let pModels      =   {};
let privModels      =   {};
// Base de Datos
mongoose.connect('mongodb://'+config.db.apiDbHost+':'+config.db.apiDbPort+'/'+config.db.apiDbName);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connected to MongoDB");
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

    let geoUtils = require(__dirname + '/../api/utils/geoUtils');
    let positionsModel = db.model('positions');
    let _yesterday = new Date();
    _yesterday.setDate(_yesterday.getDate() - 2);
    console.log(_yesterday);
    if (_yesterday) {
        positionsModel.find({createdAt: {$gt: _yesterday}}).populate([{
            path: 'vehicleId',
            model: 'vehicles'
        }]).sort('createdAt').exec(function (err, positions) {
            let _lastPosition = {};
            let _lastTime = {};
            let _lastDate = {};
            positions.forEach(function (p) {
                if (!_lastTime[p.vehicleId._id]){
                    _lastTime[p.vehicleId._id] = p.time;
                    _lastDate[p.vehicleId._id] = p.createdAt;
                    _lastPosition[p.vehicleId._id] = {lat:p.lat,lng:p.lng};
                }else{
                    let diffMs = (p.createdAt - _lastDate[p.vehicleId._id]); // milliseconds between now & Christmas
                    let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                    if (diffMins > 2) {
                        console.log(p.vehicleId.alias, 'TIME =>', _lastDate[p.vehicleId._id], p.createdAt);
                    }
                    let diffMeters = geoUtils.coordinatesToKMs(_lastPosition[p.vehicleId._id],p) * 1000;
                    if (diffMeters > 500){
                        console.log(p.vehicleId.alias, 'POINT => ' + diffMeters, _lastDate[p.vehicleId._id], p.createdAt, _lastPosition[p.vehicleId._id], {lat:p.lat,lng:p.lng});
                    }
                    _lastTime[p.vehicleId._id] = p.time;
                    _lastDate[p.vehicleId._id] = p.createdAt;
                    _lastPosition[p.vehicleId._id] = {lat:p.lat,lng:p.lng};
                }
            });
        });
    }
});


