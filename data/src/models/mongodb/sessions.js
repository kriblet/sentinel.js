/**
 * Created by Ben on 26/05/2017.
 */

const bcrypt = require('bcrypt'),
    config = require(`${__dirname}/../../../../config`);

let cryptToken = () => {
    return bcrypt.genSaltSync(10);
};

let setValidAt = (validAt)=>{
    validAt.setMinutes(validAt.getMinutes() + config.development.security.sessionExpiresMinutes);
    return validAt;
};

module.exports = (connection, mongoose, service) => {
    let sessionsSchema =  new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true
        },
        token: {
            type: String,
            required: true,
            default: cryptToken
        },
        validAt: {
            type: Date,
            required: true,
            index: true,
            set: setValidAt
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

    let beforeUpdate = (next) => {
        let _this = this;
        _this.updatedAt = new Date();
        next(_this);
    };

    sessionsSchema.pre('save', beforeUpdate);

    sessionsSchema.pre('findOneAndUpdate', beforeUpdate);

    sessionsSchema.pre('findIdAndUpdate', beforeUpdate);

    sessionsSchema.pre('update', beforeUpdate);



    return connection.model('sessions', sessionsSchema);
};