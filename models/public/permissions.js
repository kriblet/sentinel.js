/**
 * Created by ben on 10/03/2016.
 */

module.exports =  function(connection, mongoose, service) {

    let name = { type: String, index: { unique: true }};
    let permissionsSchema = {
        "name": name,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true},
        "function" : {type: mongoose.Schema.Types.ObjectId, ref: 'functions'},
        "actions" : [{type: mongoose.Schema.Types.ObjectId, ref: 'actions'}],
        visibility: { type: Number, index: { unique: false }, default: 4 }
    };

    return connection.model('permissions',permissionsSchema)
};