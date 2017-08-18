/**
 * Created by edgardo on 09/02/2016.
 */

module.exports =  function(connection, mongoose, service) {

    let name = { type: String, index: { unique: true }};
    let roleSchema  = {
        "name" : name,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true},
        "permissions": [{type: mongoose.Schema.Types.ObjectId, ref: 'permissions'}],
        "visibility" : { type: Number, index: {unique: false}, default: 4}
    };

    return connection.model('roles',roleSchema);
};
