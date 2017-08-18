/**
 * Created by edgardo on 11/7/2016.
 */

module.exports =  function (connection, mongoose, service) {
    let smsSchema = {
        from: {
            type: String,
            index: {
                unique: false
            }
        },
        user : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        to: {
            type: String,
            index:{
                unique: false
            }
        },
        text: {
            type: String,
            index: {
                unique: false
            }
        },
        location: {lat:String,lng:String},
        msgType: {type:String, enum:['text', 'image', 'video', 'audio', 'location', 'document', 'options']},
        msgId: {type:String,index:true},
        created_at: {
            type: Date,
            index: {
                unique: false
            },
            default: Date.now
        },
        try_send_at: {
            type: Date,
            index: {
                unique: false
            },
            default: Date.now
        },
        sent_at: {
            type: Date,
            index: {
                unique: false
            },
            default: new Date(0)
        },
        error: {
                error_at: {
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
        }
    };

    return connection.model('bots', smsSchema);
};