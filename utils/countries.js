/**
 * Created by ben on 02/12/2015.
 */

var config = require('../config/config');
var csv = require('ya-csv');
var fs = require('fs');
var utf8 = require('utf8');
var mongoose = require("mongoose");

var conn = mongoose.createConnection('mongodb://'+config.db.apiDbHost+':'+config.db.apiDbPort+'/'+config.db.apiDbName);

var countriesModel    =   require("../api/models-public/countries")(mongoose,conn).model;

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
            active: c.active
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




