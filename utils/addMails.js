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

var smsModel = db.model('mailings');
var data = {
    welcome: 'Bienvenido a Xentinel',
    message: 'Lorem Ipsum Blah blah',
    button_link_1: 'https://google.com',
    button_1: 'Mi Cuenta',
    message_2: 'Mensaje No. 2',
    sub_title_1: 'Servicio 1',
    sub_message_1: 'El servicio 1 es la onda',
    sub_price_1: '$299.00 /mes',
    sub_button_1 : 'Comprar',
    sub_view_link_1: 'https://gps.xentinel.io',
    sub_view_1: 'Ver más...',
    sub_title_2: 'Servicio 2',
    sub_message_2: 'El servicio 2 es la onda',
    sub_price_2: '$599.00 /mes',
    sub_button_2 : 'Comprar',
    sub_view_link_2: 'https://gps.xentinel.io',
    sub_view_2: 'Ver más...',
    company_name: 'Xentinel.io',
    company_address: 'Madero #500 Pte',
    company_city: 'Los Mochis, Sinaloa, México'
};
var sms = {};
for (var i=0; i<=0; i++){
    sms[i] = new smsModel({
        from: 'Xentinel<ben@xentinel.io>',
        to: 'enriquebenavidesm@gmail.com',
        body: JSON.stringify(data),
        subject: 'Bienvenido a Xentinel',
        template: './notifications/mailer/templates/normal/welcome.html'
    });

    sms[i].save(function(err){
        if (!err){
            console.log(i,'Saved')
        }
    });
}