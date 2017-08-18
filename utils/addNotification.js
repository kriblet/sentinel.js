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

let notificationModel = db.model('notifications');
let types= ["alert","error","report","info","warning","session"];

var notifications = {};
let cont = 0;
types.forEach(function(t){
    let images = [
        'https://s-media-cache-ak0.pinimg.com/originals/56/4d/44/564d445c298fb0a3f0a6b9d8b2a48960.jpg',
        'https://lh5.ggpht.com/33Eh5QGTochJpYi3Xo86xSgqFEmv8oJgl4mIBznu1Q6BW56MFMgVGaBVzwfpnYYlK9w=h900',
        'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider1.jpg'
    ];
    let image = '';
    switch (t){
        case 'error':
            image= ['https://lh5.ggpht.com/33Eh5QGTochJpYi3Xo86xSgqFEmv8oJgl4mIBznu1Q6BW56MFMgVGaBVzwfpnYYlK9w=h900'];
            break;
        case 'report':
            image= images;
            break;
        case 'alert':
            image= ['https://s-media-cache-ak0.pinimg.com/originals/56/4d/44/564d445c298fb0a3f0a6b9d8b2a48960.jpg'];
            break;
    }
    notifications[t] = new notificationModel({
        from: 'TestApp',
        user: '5841fa4d129de87a2fd567dc',
        to: '5841fa4d129de87a2fd567dc',
        text: 'This is a notification test of type ' + t,
        title: t + ' title',
        typeOf: t,
        images: image
    });

    //trueno id: 58955ca72f260d2457c99a46

    notifications[t+t] = new notificationModel({
        from: 'TestApp',
        user: '5841fa4d129de87a2fd567dc',
        to: '5841fa4d129de87a2fd567dc',
        text: 'This is a notification test of type ' + t,
        title: t + ' title',
        typeOf: t,
        images: image
    });

    setTimeout(function(){
        notifications[t].save(function(err){
            if (!err){
                console.log(t,'Saved')
            }
        });
        notifications[t+t].save(function(err){
            if (!err){
                console.log(t,'Saved')
            }
        });
    },20000 * cont);
    cont ++;
});