/**
 * Created by edgardo on 11/7/2016.
 */

module.exports =  function (connection, mongoose, service) {
    let smsSchema = {
        from: {type: String},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        to: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        title: {
            type: String,
            index: {
                unique: false
            }
        },
        text: {
            type: String,
            index: {
                unique: false
            }
        },
        typeOf:{type:String,enum:["alert","error","report","info","warning","session","authorization"]},
        images: [String],
        created_at: {
            type: Date,
            index: {
                unique: false
            },
            default: Date.now
        },
        readAt: {
            type: Date,
            index: {
                unique: false
            },
            default: new Date(0)
        },
        visibility: {
            type:Number,
            default:2
        }
    };

    return connection.model('notifications', smsSchema);
};