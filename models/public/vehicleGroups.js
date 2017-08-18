    /**
 * Created by VIVO on 18/11/2015.
 */
module.exports =  function(connection, mongoose, service){

    let vehicleGroupsSchema = new mongoose.Schema({
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
        name: {type: String, required: true},
        description: {type: String, required: true},
        entities: [{type: mongoose.Schema.Types.ObjectId, ref: 'vehicles'}],
        validAt: {type:Date, required: true},
        createdAt: {type:Date, default: Date.now},
        userAccess: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
        visibility: { type: Number, index: { unique: false }, default: 3 }
    });

    let userUtils = require('../utils/userUtils');
    vehicleGroupsSchema.pre('findOneAndUpdate', function (next) {
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

    return connection.model('vehicleGroups', vehicleGroupsSchema);
};