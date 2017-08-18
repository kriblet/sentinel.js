/**
 * Created by edgardo on 11/17/16.
 */

module.exports =  function (connection, mongoose, service) {

    let alertsTypeSchema = {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        name: { type: String, required: true, unique: true },
        properties: [{
            name: { type: String },
            typeOf: { type: String },
            reference: { type: String },
            isRequired: { type: Boolean }
        }],
        related: [{type: mongoose.Schema.Types.ObjectId, ref: 'alertsTypes'}],
        createdAt: { type:Date, default: Date.now, index: true },
        visibility: { type: Number, index: { unique: false }, default: 4 }
    };

    return connection.model('alertsTypes', alertsTypeSchema);
};