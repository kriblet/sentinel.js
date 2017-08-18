/**
 * Created by ben on 11/01/2016.
 */

module.exports =  function(connection, mongoose, service){
    let sessionSchema  = {
        username : {
            type: String,
            index: {
                unique: false
            }},
        email: {
            type: String,
            index:{
                unique: false
            }
        },
        password : {
            type: String,
            index: {
                unique: false
            }},
        code : {
            type: String,
            index: {
                unique: false
            }},
        verified: Boolean,
        created_at : {
            type: Date,
            index: {
                unique: false
            }}
    };

    return connection.model('codes',sessionSchema);
};

