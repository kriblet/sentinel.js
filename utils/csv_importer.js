/**
 * Created by ben on 02/12/2015.
 */

var config = require('../config').development;
var csv = require('ya-csv');
var fs = require('fs');
var utf8 = require('utf8');
var mongoose    =   require("mongoose");

var conn = mongoose.createConnection('mongodb://'+config.db.mongodb.host+':'+config.db.mongodb.port+'/'+config.db.mongodb.database);

var countriesModel    =   require("../models/public/countries")(conn, mongoose);
var states    =   require("../models/public/states")(conn, mongoose);
var cities    =   require("../models/public/cities")(conn, mongoose);

fs.readFile('./files/countries.json', function(err,content){
    var countries = JSON.parse(content);
    countries.forEach(function(c){
        if (Object.keys(c.languages).indexOf('spa') > -1 || Object.keys(c.languages).indexOf('eng') > -1){
            c.active = true;
        }
        var newCountry = new countriesModel({
            name: c.name,
            tld: c.tld,
            cca2: c.cca2,
            ccn3: c.ccn3,
            cca3: c.cca3,
            cioc: c.cioc,
            currency: c.currency,
            callingCode: c.callingCode,
            capital: c.capital,
            altSpellings: c.altSpellings,
            region: c.region,
            subregion: c.subregion,
            languages: c.languages,
            translations: c.translations,
            latlng: c.latlng,
            demonym: c.demonym,
            landlocked: c.landlocked,
            borders: c.borders,
            area: c.area,
            active: c.active,
            visibility: 4
        });

        newCountry.save(function(err){
            if (!err){
                console.log('Saved: ' + c.name.common);
            }else{
                console.warn(newCountry,err);
            }
        })
    });
});

var insertCities = function(){
    countriesModel.findOne({'name.common':new RegExp('Mexico','i')},function(err, mexicoCountry){
        if (err) {
            console.log(err);
        }else{
            var reader = csv.createCsvFileReader('./files/states.csv', {
                columnsFromHeader:false,
                separator: '\t'
            });

            reader.addListener('end', function(data){
                console.log("done");
            });
            reader.addListener('data', function(data){
                var stateName = data[0];

                var newStateModel = new states({
                    name: stateName,
                    country: mexicoCountry._id,
                    visibility: 4
                });

                newStateModel.save(function(err){
                    if (err){
                        console.log(err);
                    } else{
                        for (var i = 1; i < data.length; i++){
                            var cityName = data[i];
                            var newCityModel = new cities({
                                name:cityName,
                                state: newStateModel._id,
                                visibility: 4
                            });
                            newCityModel.save(function(err){
                                if (err){
                                    console.log(err);
                                } else{
                                    console.log("ESTADO:" + stateName + " -- CIUDAD:" + cityName + " GUARDADO EXITOSAMENTE");
                                }
                            });
                        }
                    }
                });

            });
        }
    });
};


setTimeout(insertCities,5000);



