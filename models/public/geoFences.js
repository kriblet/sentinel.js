/**
 * Created by edgardo on 11/17/16.
 */

module.exports =  function (connection, mongoose, service) {

    let geoFenceSchema = new mongoose.Schema({
        name: { type: String, required: true },
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true},
        loc: {
            type: {type: String},
            coordinates: []
        },
        color: { type: String, required: true },
        userAccess: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
        createdAt: { type:Date, default: Date.now, index: true },
        visibility: { type: Number, index: { unique: false }, default: 3 }
    });

    // define the index
    geoFenceSchema.index({loc: '2dsphere'});

    let userUtils = require('../utils/userUtils');
    geoFenceSchema.pre('findOneAndUpdate', function (next) {
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

    return connection.model('geoFences', geoFenceSchema);
};