/**
 * Created by edgardo on 2/3/17.
 */

module.exports =  function (connection, mongoose, service) {

    let entityTypeSchema = new mongoose.Schema({
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        name: { type: String, required: true, unique: true },
        createdAt: { type:Date, default: Date.now, index: true },
        visibility: { type: Number, index: { unique: false }, default: 4 }
    });

    return connection.model('entityTypes', entityTypeSchema);
};