/**
 * Created by Ben on 26/05/2017.
 */


module.exports = (connection, mongoose, service) => {
    let appsSchema =  new mongoose.Schema({
        name: {
            type: String,
            required: true,
            index: { unique: true }
        },
        updatedAt: {
            type: Date,
            index: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true
        }
    });

    appsSchema.pre('save', function(next) {
        this.updatedAt = new Date();
        next();
    });

    return connection.model('apps', appsSchema);
};