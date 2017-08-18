/**
 * Created by Ben on 07/06/2017.
 */


'use strict';

const Conf = require('../../config'),
    mongoose = require('mongoose'),
    async = require('async');

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
    let appsModel = require(__dirname + '/../src/models/mongodb/apps')(connection, mongoose);


    async.eachSeries(_conf.apps,(app, callback)=>{
        let newApp = new appsModel({
            _id: app._id || '',
            name: app.name
        });

        newApp.save((err)=>{
            if (!err){
                console.log(`New App ${newApp.name} added with _id ${newApp._id}`);
            }
            callback();
        })
    },()=>{
        process.exit();
    });
});