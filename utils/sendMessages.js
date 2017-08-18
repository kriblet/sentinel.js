
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

let usersModel = db.model('users');
let notificationsModels = db.model('notifications');

usersModel.find().then((users)=>{
    console.log(users.length);

    users.forEach((user)=>{
        let newNotification = new notificationsModels({
            from: 'Admin',
            user: '5841fa4d129de87a2fd567dc',
            to: user._id,
            text: `Estimado ${user.information.name} ${user.information.lastName}, `+
                `les informamos que estamos teniendo dificultades técnicas,`+
                ` estamos trabajando para solucionarlas lo antes posible.`,
            title: `Problemas técnicos`,
            typeOf: "info"
        });

        newNotification.save((err)=>{
            console.log("SAVE",err);
        })
    });




}).catch((err)=>{
    console.error(err);
});
