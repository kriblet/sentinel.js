/**
 * Created by ben on 09/11/2015.
 */

let bcrypt = require('bcrypt');

let cryptPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

module.exports =  function (connection, mongoose, service) {
    let userType = require('../utils/userType');
    let userTypes = [];
    for (let i in userType) { if (userType.hasOwnProperty(i)) userTypes.push(userType[i]); }
    let userSchema  = {
        username: { type: String, index: { unique: true }},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true}, // Parent userId
        password: {
            type: String,
            required: true,
            set: cryptPassword
        },
        email: { type: String,  index: {unique: true }},
        defaultCity: {type: mongoose.Schema.Types.ObjectId, ref: 'cities'},
        information: {
            avatar: {type:String, default: null, required:true},
            name: {type:String, index: {unique:false}, required:true},
            lastName: {type: String, index: {unique:false}, required:true},
            male: {type:Boolean,default:true, required:true},
            phone: {type:String, index:{unique:true}, required:true},
            mobilePhone: {type:String, index:{unique:true}, required:true},
            country: {type: mongoose.Schema.Types.ObjectId, ref: 'countries', required:true},
            state: {type: mongoose.Schema.Types.ObjectId, ref: 'states', required:true},
            city: {type: mongoose.Schema.Types.ObjectId, ref: 'cities', required:true},
            street: {type: String, index: {unique:false}, required:true},
            outsideNumber: {type: String, index: {unique:false}, required:true},
            insideNumber: {type: String, index: {unique:false}},
            neighborhood: {type: String, index: {unique:false}, required:true},
            zipCode: {type: String, index: {unique:false}, required:true},
            location: {lat:{type:String, required:true},lng:{type:String, required:true}}
        },
        security:{
            expirePassword: {type:Boolean, default:true},
            notifyPasswordExpires: {type:Boolean, default:true},
            contactByPhone: {type:Boolean, default:true},
            contactByEmail: {type:Boolean, default:true},
            sendTips: {type:Boolean, default:true}
        },
        roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'roles'}],
        permissions: [{type: mongoose.Schema.Types.ObjectId, ref: 'permissions'}],
        acceptLocation:{type:Boolean},
        acceptTerms:{type:Boolean},
        subscribeNewsLetter:{type:Boolean},
        accountLevel: {type:Number, default:0},
        userType: {type:Number, enum: userTypes, default: userType.user},
        visibility: { type: Number, index: { unique: false }, default: 3},
        subUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
        subscribers: [{
            id:{type: String},
            typeOf: {type: String, enum: ['telegram', 'facebook']}
        }],
        owner:[{
            id: {type: String},
            typeOf: {type: String, enum: ['telegram', 'facebook']}
        }],
        locale:{type:String, default:'es'},
        updatedAt: {
            type: Date,
            index: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true
        },
        active: {
            type: Boolean,
            index: true,
            default: true
        }
    };

    let schema = new mongoose.Schema(userSchema);

    schema.post('save', function () {
        const usersModel = connection.model('users');
        let changes = {'$push':{'subUsers' : this._id}};
        usersModel.findOneAndUpdate({_id: this.userId}, changes, function (err) {
            if (err) console.warn(err);
        });

        const subsUtils = require('../utils/subscriptionUtils')(connection, mongoose, service);
        subsUtils.generateCode({
            userId: this._id
        });

    });

    return connection.model('users', schema);
};