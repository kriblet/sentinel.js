
/**
 * Created by edgardo on 28/07/2016.
 */

module.exports =  function (connection, mongoose, service) {
    let passChangesSchema  = {
        partnerId: {type: mongoose.Schema.Types.ObjectId, ref: 'partners', required: true},
        created_at: {
            type: Date,
            index: {unique: false},
            default: Date.now
        },
        ip: {
            type: String,
            index: {unique: false},
            require: true
        },
        oldPassword:{
            type: String
        },
        newPassword:{
            type: String
        }
    };

    return connection.model('passChanges', passChangesSchema);
};