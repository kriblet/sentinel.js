/**
 * Created by Ben on 07/06/2017.
 */


'use strict';

const Conf = require('../../config'),
    mongoose = require('mongoose');

let _conf = null;

if (process.argv.indexOf('--beta') > -1){
    _conf = Conf.beta;
}else if (process.argv.indexOf('--production') > -1){
    _conf = Conf.production;
}else {
    _conf = Conf.development;
}

let options = null;

Object.keys(_conf.db).forEach((c)=>{
    let cc = _conf.db[c];
    if (cc.engine === "mongodb"){
        options = cc;
    }
});

let connection = mongoose.createConnection();
connection.open(`mongodb://${options.username ? options.username + ':' + options.password + '@' : ''}${options.host}:${options.port}/${options.database}?authSource=admin`, {
    uri_decode_auth: true
});

connection.on("open",()=>{
    let usersModel = require(__dirname + '/../../models/public/users')(connection, mongoose);

    let newUser = new usersModel({
        _id: '5841fa4d129de87a2fd567dc',
        name: 'Admin',
        username: "hexenon",
        lastName: 'Administrator',
        password: 'berktown',
        email: 'ben@xentinel.io',
        acceptLocation: true,
        acceptTerms: true,
        subscribeNewsLetter: true,
        userType: 1,
        visibility: 3,
        accountLevel: 0,
        permissions: [],
        roles: [],
        userId: '5841fa4d129de87a2fd567dc',
        security: {
            expirePassword: true,
            notifyPasswordExpires: true,
            contactByPhone: false,
            contactByEmail: false,
            sendTips: true
        },
        information: {
            avatar: "a",
            male: true,
            location: {
                lng: "-108",
                lat: "25"
            },
            name: "Ben",
            lastName: "Benavides",
            phone: "6988920450",
            mobilePhone: "6681483586",
            state: "584657b5ab3bac34eb594676",
            city: "584657b5ab3bac34eb594703",
            country: "584657b0ab3bac34eb5945f4",
            street: "Viñedo de toscana",
            outsideNumber: "1295",
            neighborhood: "Viñedos",
            zipCode: "81228"
        },
        locale: "es"
    });


    newUser.save((err)=>{
        if (!err){
            console.log(`New User ${newUser.name} added with _id ${newUser._id}`);
        }else{
            console.log('error',err.message);
        }
        process.exit();
    })
});