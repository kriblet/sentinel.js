/**
 * Created by edgardo on 09/02/2016.
 */

module.exports =  function(connection, mongoose, service) {
    let functionSchema  = {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        "name" : {
            type: String,
            index: {
                unique: false
            }},
        "description" : {
            type: String,
            index: {
                unique: false
            }},
        "visibility" : {
            type: Number,
            index: {
                unique: false
            }}
    };

    return connection.model('functions',functionSchema);
};
