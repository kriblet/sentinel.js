/**
 * Created by duan on 11/04/2017.
 */
//let config = require('../config/config-local');
let vinGenerator = require('./vinGenerator');
let fs = require('fs');
let utf8 = require('utf8');
let mongoose = require("mongoose");
//let conn = mongoose.createConnection('mongodb://localhost/'+config.db.apiDbName);
let users = {};
let usersSaved;
let devicesSaved;
let vehiclesSaved;
let adminUserId = "5841fa4d129de87a2fd567dc";
let usersModel = require("../api/models-public/users")(mongoose,conn).model;
let vehiclesModel = require("../api/models-public/vehicles")(mongoose,conn).model;
let devicesModel = require("../api/models-public/devices")(mongoose,conn).model;

fs.readFile('./files/devices.json', function(err,content){
    let devices = JSON.parse(content);
    devices.forEach(function(device){
        if(!users.hasOwnProperty(device.username)){
            users[device.username] = {
                username: device.username,
                email: device.email,
                password: device.password,
                user_phone: device.user_phone,
                user_mobile_phone: device.user_mobile_phone,
                devices: []
            };
        }
        users[device.username].devices.push(
            {
                name: device.name,
                imei: device.imei,
                phone: device.phone,
                userId: "",
                vehicle:{
                    name: device.name,
                    vehicleType: "1",
                    deviceId: ""
                }
            }
        );
    });

    saveUsers();
});
function saveUsers() {


    Object.keys(users).forEach(function (val){
        let user = users[val];
        let newUser = new usersModel({
            userId: adminUserId,
            username: user.username,
            password: user.password,
            email: user.email,
            defaultCity: mongoose.Types.ObjectId("584657b5ab3bac34eb59467e"),
            information: {
                avatar: "default",
                name: "no name",
                lastName: "no last name",
                phone: user.user_phone,
                mobilePhone: user.user_mobile_phone,
                country: mongoose.Types.ObjectId("584657b0ab3bac34eb5945f4"),
                state: mongoose.Types.ObjectId("584657b5ab3bac34eb594676"),
                city: mongoose.Types.ObjectId("584657b5ab3bac34eb594703"),
                street: "no street",
                outsideNumber: "0",
                neighborhood: "default",
                zipCode: "00000",
                location: {lat:"25.7667",lng:"-108.9667"}
            }
        });


        let filter = {userName: user.userName};
        usersModel.find(filter,function (err, user) {
                if (!err) {
                    if(user.length > 0){
                        users[val].userId = user._id;
                        saveDevice(users[val]);
                    }else{
                        newUser.save(function (err, user) {
                            if (!err) {
                                console.log("saved", user.username);
                                users[val].userId = newUser._id;
                                saveDevice(users[val]);
                            } else {
                                //error
                                console.warn("erorr on save",users[val].username, err.message);
                            }
                        });
                    }
                }
            }
        );
        /*  usersModel.save(function(err){
         if (!err){
         console.log('Saved: ' + c.name.common);
         }else{
         console.warn(newCountry,err);
         }
         });*/
    });
}
function saveDevice(user) {

    Object.keys(user.devices).forEach(function (val){
        let device = user.devices[val];
        let newDevice = new devicesModel({
            name: device.name,
            imei: device.imei,
            phone: device.phone,
            userId: user.userId,
            attached: true,
            active: true,
            userAccess: []
        });

        let filter = {imei: device.imei};
        devicesModel.find(filter,function (err, data) {
            if (!err) {
                if(user.length > 0){
                    device.deviceId = data._id;
                    device.userId = newDevice.userId;
                    saveVehicle(device);
                }else{
                    newDevice.save(function (err, data) {
                        if (!err) {
                            console.log("saved", newDevice.name);
                            device.deviceId = newDevice._id;
                            device.userId = newDevice.userId;
                            saveVehicle(device);
                        } else {
                            //error
                            console.warn("erorr on save",newDevice.name, err.message);
                        }
                    });
                }
            }
        });
    });
}
function saveVehicle(device) {


    let newVehicle = vehiclesModel({
        name: device.vehicle.name,
        alias: device.vehicle.name,
        licensePlate: "AA00AA",
        brand: "no set",
        model: "no set",
        year: "0000",
        vin: vinGenerator.generateVin(),
        performance: 12,
        gasTank: 40,
        deviceId: device.deviceId,
        vehicleType: 1,
        userId:  mongoose.Types.ObjectId(device.userId),
        entityTypeId:  mongoose.Types.ObjectId("58957f1e848e1024b7881437"),
        color: "#ff0100",
    });

    let filter = {deviceId: device.deviceId};
    vehiclesModel.find(filter,function (err, vehicle) {
        if (!err) {
            if(vehicle.length > 0){
                vehicle.vehicleId = vehicle._id;
            }else{
                newVehicle.save(function (err, vehicle) {
                    if (!err) {
                        console.log("saved", newVehicle.name);
                        vehicle.vehicleId = newVehicle._id;
                    } else {
                        //error
                        console.warn("erorr on save",newVehicle.name, err.message);
                        console.log(err);
                    }
                });
            }
        }
    });
}
