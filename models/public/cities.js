/**
 * Created by VIVO on 18/11/2015.
 */
module.exports =  function(connection, mongoose, service){
    let citySchema  = {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        "name" : {
            type: String,
            index: {
                unique: false
            }},
        "state" :  {type: mongoose.Schema.Types.ObjectId, ref: 'states'},
        "location": {
            "lat": String,
            "lng": String
        },
        visibility: { type: Number, index: { unique: false }, default: 4 }
    };

    return connection.model('cities',citySchema);
};