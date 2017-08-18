/**
 * Created by edgardo on 1/27/17.
 */

module.exports =  function(connection, mongoose, service) {

    let subscriptionCodeSchema = new mongoose.Schema({
        code: { type: String, index: { unique: true }},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        createdAt: {type:Date, default: Date.now, index: true},
        visibility: { type: Number, index: { unique: false }, default: 4 }
    });

    return connection.model('ownerCodes', subscriptionCodeSchema);
};