/**
 * Created by VIVO on 18/11/2015.
 */
module.exports =  function(connection, mongoose, service){
    let devicesSchema  = new mongoose.Schema({
        name: {type:String, index:{unique:true}},
        imei: {type:String, index:{unique:true}},
        phone: {type:String, index:{unique:true}},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        lastSeen: {type:Date},
        createdAt: {type:Date, default: Date.now },
        attached: {type:Boolean, default: false},
        active: {type:Boolean, default: false},
        visibility: { type: Number, index: { unique: false }, default: 3 },
        userAccess: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]

    });

    let userUtils = require('../utils/userUtils');
    devicesSchema.pre('findOneAndUpdate', function (next) {
        let that = this;
        if (that._update.updateUserId === undefined)
            return next();
        let usersModel = connection.model('users');
        userUtils.userAccessVerify(that, usersModel, that._update, that._update.updateUserId)
            .then(function(finalUserAccess) {
                that._update.userAccess = finalUserAccess;
                next();
            }).catch(function (err) {
            console.warn(err);
            next(err);
        });
    });

    return connection.model('devices',devicesSchema);
};