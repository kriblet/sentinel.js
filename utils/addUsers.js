
/**
 * Created by ben on 03/06/2016.
 */

var config = require('../config/config');
var mongoose    =   require("mongoose");

var fs = require('fs');

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

var usersModel = db.model('users');

// test imei: 359710048734785
// test imei: 359710045965184
usersModel.remove({});
var newUser = new usersModel(
    {
        "username": "psyban",
        "password": "sha512|16|aGRPIb1y8KSQ0sHq+3edlh2nxzBkXjTmmrr7GzSNcxZdburKHce2qiAp8WEqBWKNF+P2V7hN8Uv6Bum/iRmprA==|gxyjr4jknLP6QB7/aFJDlR23GYXI13EiTPesw61xWaIQFKGzdgVKqqtyr1OheX00",
        "acceptLocation": true,
        "acceptTerms": true,
        "acceptDirectives": true,
        "email": "ivanvega3090@gmail.com",
        "subscribeNewsLetter": true,
        "defaultCity": "57a8fbb9f2cd19f62932ba2a",
        "visibility": 3,
        "created_at": new Date(),
        "likesCount": 0,
        "likes": [],
        "active": false,
        "accountLevel": 0,
        "accountExperience": 0,
        "security": {
            "sendTips": true,
            "contactByEmail": true,
            "contactByPhone": true,
            "notifyPasswordExpires": true,
            "expirePassword": true
        },
        "information": {
            "name": "Ben",
            "lastName": "Benavides",
            "phone": "6988920450",
            "mobilePhone": "6681483586",
            "state": "57a8fbb9f2cd19f62932b9a2",
            "city": "57a8fbb9f2cd19f62932ba2a",
            "country": "57a8fbb4f2cd19f62932b91f",
            "street": "Viñedo de toscana",
            "outsideNumber": "1295",
            "neighborhood": "Viñedos",
            "zipCode": "81228",
            "location": {
                "lat": "25.82478811800112",
                "lng": "-108.98743507091672"
            },
            "male": true,
            "avatar": "https://static.tarjeterovirtual.com/images/default-avatar-alien-monster.png"
        },
        userType: 1
    });



var vehiclesModel = db.model('vehicles');

// test imei: 359710048734785
// test imei: 359710045965184


var devicesModel = db.model('devices');

vehiclesModel.remove({});
devicesModel.remove({});

var newDevice = new devicesModel({
    "name": "Device Serial [18374912]",
    "imei": "359710048734785",
    "phone": "6681483586",
    "active": true,
    "attached": true,
    "createdAt": new Date()});

var newDevice2 = new devicesModel({
    "name": "Device Serial [8745654]",
    "imei": "359710045965184",
    "phone": "6681483587",
    "active": true,
    "attached": true,
    "createdAt": new Date()});

var newDevice3 = new devicesModel({
    "name": "Device Serial [37293203]",
    "imei": "359710046031556",
    "phone": "6681483588",
    "active": true,
    "attached": true,
    "createdAt": new Date()});



newDevice.save(function(err){
    if (!err) {
        newDevice2.save(function (err) {
            if (!err) {
                newDevice3.save(function (err) {
                    if (!err) {
                        newUser.save(function (err) {
                            if (!err) {
                                console.log(newUser._id);
                                var newVehicle = new vehiclesModel({
                                    name: "Carro A",
                                    alias: "A-201",
                                    licensePlate: "VKL-839",
                                    vehicleType: 1,
                                    deviceId: newDevice._id,
                                    vin: '12312312311',
                                    year: '2012',
                                    brand: 'Nissan',
                                    model: 'Sentra',
                                    userId: newUser._id,
                                    createdAt: new Date(),
                                    active: true
                                });
                                newVehicle.save(function (err) {
                                    if (err) {
                                        console.warn('Error happened : ' + err);
                                    } else {
                                        console.log('Vehicle inserted :)  ' + newVehicle._id);
                                    }
                                });
                                var newVehicle2 = new vehiclesModel({
                                    name: "Carro B",
                                    alias: "A-202",
                                    licensePlate: "VRA-475",
                                    vehicleType: 2,
                                    deviceId: newDevice2._id,
                                    userId: newUser._id,
                                    vin: '12312312312',
                                    year: '2012',
                                    brand: 'Nissan',
                                    model: 'Sentra',
                                    createdAt: new Date(),
                                    active: true
                                });
                                newVehicle2.save(function (err) {
                                    if (err) {
                                        console.warn('Error happened : ' + err);
                                    } else {
                                        console.log('Vehicle inserted :)  ' + newVehicle2._id);
                                    }
                                });

                                var newVehicle3 = new vehiclesModel({
                                    name: "Carro Amor",
                                    alias: "Amor Wendy",
                                    licensePlate: "VRK-475",
                                    vehicleType: 2,
                                    deviceId: newDevice3._id,
                                    userId: newUser._id,
                                    vin: '12312312313',
                                    year: '2012',
                                    brand: 'Nissan',
                                    model: 'Sentra',
                                    createdAt: new Date(),
                                    active: true
                                });
                                newVehicle3.save(function (err) {
                                    if (err){
                                        console.warn('Error happened : '  + err);
                                    }else{
                                        console.log('Vehicle inserted :)  ' + newVehicle3._id);
                                    }
                                });

                            } else {
                                console.warn('Error happened : ' + err);
                            }
                        });
                    }else {
                        console.warn('Error happened : ' + err);
                    }
                });
            }else{
                console.warn('Error happened : '  + err);
            }
        });
    }else{
        console.warn('Error happened : '  + err);
    }
});
