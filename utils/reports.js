
/**
 * Created by ben on 03/06/2016.
 */

let config = require('../config/config');
let mongoose    =   require("mongoose");

let fs = require('fs');
let async = require("async");


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
});


// Extracción de los modelos existentes.
publicModels.forEach(function(val){
    val = val.replace('.js','');
    pModels[val] = require('../api/models-public/' + val)(mongoose, db);
});

privateModels.forEach(function(val){
    val = val.replace('.js','');
    privModels[val] = require('../api/models-private/' + val)(mongoose, db);
});

let users = db.model('users');
let vehicles = db.model('vehicles');
let devices = db.model('devices');
let positions = db.model('positions');


let pdf = require('html-pdf');
let options = {format: 'Letter'};
let ejs = require("ejs");
let username = null;
process.argv.forEach(function (val, index, array) {
    if (val==='--user'){
        username = array[index+1];
    }
});

let findUser = (username,callback)=>{
    if (username){
        console.log(username,"username");
        users.findOne({username:new RegExp(username,"i")}).select("_id username").lean().exec().then((usr)=>{
            console.log(usr,"USER");
            callback(usr);
        });
    }else{
        callback(null);
    }
};

let exportPdf = (usr)=> {
    let filter = {};
    if (usr){
        filter = {$or:[{userId: usr._id},{userAccess: usr._id}]};
    }
    entities.find(filter).select("_id alias").lean().exec().then((vs) => {

        let funcs = [];
        let positionsArray = [];

        vs.forEach((v) => {
            funcs.push((cb) => {
                positions.find({vehicleId: v._id}).select("lat lng createdAt vehicleId").sort("-createdAt").lean().limit(10).exec().then((result) => {
                    positionsArray = positionsArray.concat(result);
                    cb(null, result);
                }).catch(cb);
            });
        });

        async.parallel(funcs, (err, info) => {
            if (err) {
                return console.error(err);
            }
            ejs.renderFile("./templates/template.ejs", {
                entities: vs,
                positions: positionsArray
            }, options, function (err, HTML) {
                // str => Rendered HTML string
                pdf.create(HTML, options).toFile('./downloads/file.pdf', function (err, result) {
                    if (err) {
                        console.error(err);
                    }
                    console.log(result);
                });
            });

        });


    }).catch((err) => {
        console.error(err);
    });

};


findUser(username, exportPdf);