    /**
 * Created by VIVO on 18/11/2015.
 */
module.exports =  function (connection, mongoose, service) {

    let alertsConfigsSchema = new mongoose.Schema({
        name: {type:String, required: true},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true},
        alertsTypes: [{type: mongoose.Schema.Types.ObjectId, ref: 'alertsTypes', required: true, index: true}],
        vehicleGroupId:{type: mongoose.Schema.Types.ObjectId, ref: 'vehicleGroups', index: true},
        vehicleId:{type: mongoose.Schema.Types.ObjectId, ref: 'vehicles', index: true},
        config: {type: Object, required: true},
        expireMinutes: {type:Number, default:60},
        nextTriggerAt: {type:Date, default: Date.now, index: true},
        lastTriggered: {
            alertsTriggeredId:{type: mongoose.Schema.Types.ObjectId, ref: 'alertsTriggered', index: true},
            triggeredAt: {type: Date}
        },
        hours: [{
            begin:{
                hour: {type:Number, min: 0, max: 23},
                minute: {type:Number, min: 0, max: 59}
            },
            final: {
                hour: {type:Number, min: 1, max: 24},
                minute: {type:Number, min: 0, max: 59}
            }
        }],
        days: {
            monday: {type:Boolean, default: false},
            tuesday: {type:Boolean, default: false},
            wednesday: {type:Boolean, default: false},
            thursday: {type:Boolean, default: false},
            friday: {type:Boolean, default: false},
            saturday: {type:Boolean, default: false},
            sunday: {type:Boolean, default: false}
        },
        extraContacts: {
            emails: [String],
            phones: [String]
        },
        validAt: {type:Date, required: false, index: true},
        createdAt: {type:Date, default: Date.now, index: true},
        visibility: { type: Number, index: { unique: false }, default: 3 },
        userAccess: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
        subscribers: [{
            id:{type: String},
            typeOf: {type: String, enum: ['telegram', 'facebook']}
        }],
        activeShutdown:{type:Boolean, default: false},
        muted: {type:Boolean, default: false}
    });

    alertsConfigsSchema.post('save', function () {
        const subsUtils = require('../utils/subscriptionUtils')(connection, mongoose, service);
        subsUtils.generateCode({
            alertsConfigId: this._id
        });
    });
    let userUtils = require('../utils/userUtils');
    alertsConfigsSchema.pre('findOneAndUpdate', function (next) {
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

    return connection.model('alertsConfigs', alertsConfigsSchema);
};