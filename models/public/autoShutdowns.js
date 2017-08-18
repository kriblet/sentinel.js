/**
 * Created by duan on 19/05/2017.
 */
module.exports =  function(connection, mongoose, service){
    let autoShutdownsSchema  = new mongoose.Schema({
        name: {type:String, index:{unique:true}},
        vehicleGroup:{type: mongoose.Schema.Types.ObjectId, ref: 'vehicleGroups', index: true},
        vehicles: [{type: mongoose.Schema.Types.ObjectId, ref: 'vehicles'}],
        hours: {
            begin:{
                hour: {type:Number, min: 0, max: 23},
                minute: {type:Number, min: 0, max: 59}
            },
            final: {
                hour: {type:Number, min: 1, max: 24},
                minute: {type:Number, min: 0, max: 59}
            }
        },
        days: {
            monday: {type:Boolean, default: false},
            tuesday: {type:Boolean, default: false},
            wednesday: {type:Boolean, default: false},
            thursday: {type:Boolean, default: false},
            friday: {type:Boolean, default: false},
            saturday: {type:Boolean, default: false},
            sunday: {type:Boolean, default: false}
        },
        visibility: { type: Number, index: { unique: false }, default: 3 },
        createdAt: {type:Date, default: Date.now, index: true},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true},
        userAccess: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
        active:{type:Boolean, default:true},
        timeOffset:{type:Number}
    });

    let userUtils = require('../utils/userUtils');
    autoShutdownsSchema.pre('findOneAndUpdate', function (next) {
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

    return  connection.model('autoShutdowns',autoShutdownsSchema)
};