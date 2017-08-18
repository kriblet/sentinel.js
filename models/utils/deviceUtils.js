/**
 * Created by edgardo on 11/27/16.
 */

module.exports = function (connection, mongoose, service) {
    return {
        link: function(vehicle, next) {
            this.setStatus(vehicle, true, true, next);
        },
        unlink: function(vehicle, next) {
            this.setStatus(vehicle, false, false, next);
        },
        swap: function(vehicle, next) {
            connection.model('vehicles').findOne({_id: vehicle._id}, function (err, old) {
                if (err) {
                    console.warn(err);
                    return err;
                } else {
                    if (vehicle.deviceId !== old.deviceId) {
                        this.unlink(old, function () {
                            this.link(vehicle, next)
                        });
                    }
                }
            });
        },
        setStatus: function (vehicle, attached, active, next) {
            var changes = {attached: attached, active: active};
            connection.model('devices').findOneAndUpdate({"_id": vehicle.deviceId}, changes, function (err, old) {
                if (err) {
                    console.warn(err);
                    return err;
                } else if (!old) {
                    return {name: 'DeviceNotFoundError', message: 'Device not found'}
                } else {
                    next();
                }
            });
        }
    }
};