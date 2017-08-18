/**
 * Created by ben on 09/11/2015.
 */
module.exports =  function(connection, mongoose, service) {
    let vehiclesSchema = new mongoose.Schema({
        name: { type: String, index: { unique: true }, required: true},
        alias: { type: String, index: { unique: true }},
        licensePlate: { type: String, index: { unique: true }, required: true},
        brand: { type: String, index: { unique: false }, required: true},
        model: { type: String, index: { unique: false }, required: true},
        year: { type: String, index: { unique: false }, required: true},
        vin: { type: String, index: { unique: true }, required: true},
        performance: {type: Number, required: false},
        gasTank: {type: Number, required: false},
        vehicleType:{type: Number, required: true},
        deviceId: {type: mongoose.Schema.Types.ObjectId, ref: 'devices'},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        entityTypeId: {type: mongoose.Schema.Types.ObjectId, ref: 'entityTypes'},
        createdAt: { type: Date, default: Date.now },
        nextPaymentAt: { type: Date },
        active: { type: Boolean, default: false },
        color: { type: String, required: true },
        userAccess: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
        visibility: { type: Number, index: { unique: false }, default: 3 },
        engineStatus:{type:Boolean, default:true},
        activeShutdown:{type:Boolean, default: false}
    });

    let deviceUtils = require('../utils/deviceUtils')(connection, mongoose, service);
    let userUtils = require('../utils/userUtils');
    vehiclesSchema.post('save', function (doc) {
        deviceUtils.link(doc, () => {});
    });

    vehiclesSchema.pre('findOneAndUpdate', function (next) {
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

    vehiclesSchema.post('remove', function (doc) {
        deviceUtils.unlink(doc, () => {});
    });

    vehiclesSchema.post('update', function (doc) {
        deviceUtils.swap(doc, () => {});
    });

    return connection.model('vehicles',vehiclesSchema);
};