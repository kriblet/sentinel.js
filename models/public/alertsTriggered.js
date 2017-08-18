/**
 * Created by edgardo on 1/29/17.
 */

module.exports =  function (connection, mongoose, service) {

    let alertsTriggeredSchema = new mongoose.Schema({
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true},
        alertsConfig: {type: mongoose.Schema.Types.ObjectId, ref: 'alertsConfigs', required: true, index: true},
        vehicle: {type: mongoose.Schema.Types.ObjectId, ref: 'vehicles', required: true, index: true},
        position: {type: mongoose.Schema.Types.ObjectId, ref: 'positions', required: true, index: true},
        result: {type: Object, required: true},
        validAt: {type: Date, required: false, index: true, default: Date.now},
        sentAt: {type: Date, required: false, index: true, default: new Date(0)},
        readAt: {type: Date, required: false, index: true},
        error: {
            errorAt: {
                type: Date,
                index: {
                    unique: false
                }
            },
            message: {
                type: String,
                index: {
                    unique: false
                }
            }
        },
        createdAt: {type: Date, default: Date.now, index: true},
        visibility: { type: Number, index: { unique: false }, default: 3 },
    });

    alertsTriggeredSchema.post('save', function () {
        const positionsModel = connection.model('positions');
        if (this.position) {
            positionsModel.findOneAndUpdate(
                {_id: this.position},
                {alertId: this._id},
                function (err) {
                    console.warn(err);
                }
            );
        }
    });

    return connection.model('alertsTriggered', alertsTriggeredSchema);
};