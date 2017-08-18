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

    let botsModels = db.model('bots');
    let users = db.model('users');
    users.findById({_id:"dc94ec785db620bb370f"}, function(err,user){
        user.subscribers.forEach(function(s){
            let sendText = new botsModels({
                from: s.typeOf,
                to: s.id,
                msgType: 'text',
                text: 'El vehículo [Wendy Madrid] ha entrado en la Geo-Cerca [Trabajo] a las ' + new Date().toDateString(),
                user: user._id
            });
            sendText.save(function(err){
                if (!err) {
                    let sendLocation = new botsModels({
                        from: s.typeOf,
                        to: s.id,
                        location: {
                            lat: "25.78579",
                            lng: "-108.992532"
                        },
                        msgType: 'location',
                        text: 'Ubicación',
                        user: user._id
                    });
                    sendLocation.save(function (err) {
                        console.log(err ? err : 'GUARDADO');
                    })
                }
            });

        });
    });
    return;
});


/*
let sms = {};
for (let i=0; i<=0; i++){
    let telegramData = {
        from: 'telegram',
        to: "84002038",
        msgType: 'text',
        text: 'Ubicación',
        user: 'USERID'
    };
    let _telegramMessage = new smsModel(telegramData);
    _telegramMessage.save(function(err){
        if (!err && false){
            console.log(i,'Saved');
            telegramData.msgType = 'document';
            telegramData.text = 'http://www.axmag.com/download/pdfurl-guide.pdf';
            _telegramMessage = new smsModel(telegramData);
            _telegramMessage.save(function(err){
                if (!err){
                    console.log(i,'Saved');
                    telegramData.msgType = 'audio';
                    telegramData.text = 'http://www.sample-videos.com/audio/mp3/wave.mp3';
                    _telegramMessage = new smsModel(telegramData);
                    _telegramMessage.save(function(err){
                        if (!err){
                            console.log(i,'Saved');
                            telegramData.msgType = 'video';
                            telegramData.text = 'http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_2mb.mp4';
                            _telegramMessage = new smsModel(telegramData);
                            _telegramMessage.save(function(err){

                            });
                        }
                    });
                }
            });
        }
    });

    let facebookData = {
        from: 'facebook',
        to: "1221751181246238",
        location:{lat:'19.43194',lng:'-99.13306'},
        msgType: 'location',
        text: 'Ubicación'
    };
    let _facebookMessage = new smsModel(facebookData);

    _facebookMessage.save(function(err){
        if (!err && false){
            console.log(i,'Saved');
            facebookData.msgType = 'document';
            facebookData.text = 'http://www.axmag.com/download/pdfurl-guide.pdf';
            _facebookMessage = new smsModel(facebookData);
            _facebookMessage.save(function(err){
                if (!err && false){
                    console.log(i,'Saved');
                    facebookData.msgType = 'audio';
                    facebookData.text = 'http://www.sample-videos.com/audio/mp3/wave.mp3';
                    _facebookMessage = new smsModel(facebookData);
                    _facebookMessage.save(function(err){
                        if (!err){
                            console.log(i,'Saved');
                            facebookData.msgType = 'video';
                            facebookData.text = 'http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_2mb.mp4';
                            _facebookMessage = new smsModel(facebookData);
                            _facebookMessage.save(function(err){

                            });
                        }
                    });
                }
            });
        }
    });
}
*/