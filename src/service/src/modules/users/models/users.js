/**
 * Created by ben on 04/03/2016.
 */

let bcrypt = require('bcrypt');

let cryptPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};


module.exports =  function(connection, mongoose, service){
    let usersSchema = {
        name: {type: String, index: true, required: true},
        lastName: {type: String, index: true},
        email: {type: String, index: { unique: true }, required: true},
        password: {
            type: String,
            required: true,
            set: cryptPassword
        },
        createdAt: {type: Date, index: true, default: Date.now },
        updatedAt: {type: Date, index: true, default: Date.now },
        deletedAt: {type: Date, index: true, default: Date.now },
        active: {type: Boolean, index: true, default: true}
    };
    let schema = new mongoose.Schema(usersSchema);
    schema.pre('save', function () {
        this.updatedAt = new Date();
    });


    return {
        model: connection.model('users', schema),
        public: false
    };
};