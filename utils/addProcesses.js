/**
 * Created by ben on 03/06/2016.
 */

let config = require('../config/config');
let fs = require('fs'),
    apiConnection = require(__dirname + '/../api/utils/apiConnection');

let mongoose = apiConnection.mongoose;
let db = apiConnection.connection;
let pModels = apiConnection.pubModels;
let privModels = apiConnection.privModels;


let processesModel = db.model('processes');

let processToSave = {};
processToSave['start'] = new processesModel({
    name: 'Start Process',
    inputPattern: "^\/(start|inicio)$",
    workSpace: 'start',
    steps: [{
        onValidate: 'validate',
        onSuccess: 'onSuccess',
        onError: 'onError'
    }]
});

processToSave['subscribe'] = new processesModel({
    name: 'Subscribe Process',
    inputPattern: "^\/(subscribe|suscribir|suscribirse|evento|registrar|register)([0-9])*",
    workSpace: 'subscribe',
    steps: [{
        onValidate: 'validate',
        onSuccess: 'onSuccess',
        onError: 'onError'
    }]
});

processToSave['linkAccount'] = new processesModel({
    name: 'Link Account Process',
    inputPattern: "^\/(link|login|sesion|enlazar|enlace)([0-9])*",
    workSpace: 'link',
    steps: [{
        onValidate: 'validate',
        onSuccess: 'onSuccess',
        onError: 'onError'
    }]
});

Object.keys(processToSave).forEach(function(key){
    processToSave[key].save(function(err){
        console.log(processToSave[key].name, processToSave[key]._id);
    })
});

/*
// Working as a charm
let newProcess3 = new processesModel({
    name: 'Echo Image Process',
    inputPattern: "^image",
    workSpace: 'parser',
    responseType: 'Image',
    content: 'http://assets2.bigthink.com/system/idea_thumbnails/48438/size_1024/brain%20computer%20chip%20SS.jpg?1353856708',

});

newProcess3.save(function(err){
    console.log('Echo Image: ', newProcess._id);
});

//todo: finish this crap

let newProcess4 = new processesModel({
    name: 'Echo Between Process',
    inputPattern: "^between",
    workSpace: 'parser',
    responseType: 'Text',
    content: 'Parameters <%one%>,<%two%>',
    textParameters: [{
        name: 'one',
        caseSensitive: false,
        between:{
            start:'[',end:']'
        }
    },{
        name: 'two',
        caseSensitive: false,
        between:{
            start:'{',end:'}'
        }
    }]
});
newProcess4.save(function(err){
    console.log('Echo Between: ', newProcess._id);
});

 */
