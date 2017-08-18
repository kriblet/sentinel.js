/**
 * Created by VIVO on 18/11/2015.
 */
module.exports =  function(connection, mongoose, service){
    let countrySchema  = {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        name: {
            common: {type: String, index: {unique: true}},
            official: {type: String},
            native: {type: Object}
        },
        tld: { type:[String] },
        cca2: {type:String, index:{unique:true}},
        ccn3: {type:String, index:{unique:true}},
        cca3: {type:String, index:{unique:true}},
        cioc: {type:String},
        currency: { type:[String] },
        callingCode: { type:[String] },
        capital: {type:String},
        altSpellings: { type:[String] },
        region: {type:String},
        subregion: {type:String},
        languages: {type:Object},
        translations: {type:Object},
        latlng: {type:[Number]},
        location: {
            lat: String,
            lng: String
        },
        demonym: {type:String},
        landlocked: {type:Boolean},
        borders: {type:[String]},
        area: {type:Number},
        active: {type:Boolean, default: false},
        visibility: { type: Number, index: { unique: false }, default: 4 }
    };

    return connection.model('countries',countrySchema);
};