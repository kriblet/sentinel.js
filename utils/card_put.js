/**
 * Created by ben on 02/12/2015.
 */

var config = require('../config/config');
var csv = require('ya-csv');
var fs = require('fs');
var utf8 = require('utf8');
var mongoose    =   require("mongoose");

var conn = mongoose.createConnection('mongodb://'+config.db.apiDbHost+':'+config.db.apiDbPort+'/'+config.db.apiDbName);

var profilesModel =   require("../api/models-public/profiles")(mongoose,conn).model;
var profilesRequestModel=   require("../api/models-public/profilesRequests")(mongoose,conn).model;
var partnersModel =   require("../api/models-private/partners")(mongoose,conn).model;
var citiesModel =   require("../api/models-public/cities")(mongoose,conn).model;
var statesModel =   require("../api/models-public/states")(mongoose,conn).model;

var reader = csv.createCsvFileReader('./files/cards_asign.csv', {
    columnsFromHeader:true,
    separator: ','
});

reader.addListener('end', function(data){
    console.log("done");
});

reader.addListener('data', function(data) {
    var email = data['email'];
    var name = data['name'];
    partnersModel.find({email: email}, function(err,docs){
        if (docs.length === 0){
            console.log('Not found: ' + email)
        }else{
            statesModel.findOne({name: data.state},function(err, state){
                if (state){
                    citiesModel.findOne({name: data.city, state: state._id}, function(err,city){
                        if (city){
                            profilesModel.find({
                                state: state._id,
                                company: new RegExp(name,'i')
                            }, function(err, profiles){
                                console.warn(name + " " + state.name +  ' : ' + profiles.length);
                            });
                        }
                    })
                }
            });
        }
    });

});

