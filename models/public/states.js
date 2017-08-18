/**
 * Created by VIVO on 18/11/2015.
 */
module.exports =  function(connection, mongoose, service){
    let stateSchema  = {
        "name" : {
            type: String,
            index: {
                unique: false
            }},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false, index: true},
        "country" :  {type: mongoose.Schema.Types.ObjectId, ref: 'countries'},
        "location": {
            "lat": String,
            "lng": String
        },
        visibility: { type: Number, index: { unique: false }, default: 4 }
    };

    return connection.model('states',stateSchema);
};