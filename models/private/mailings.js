/**
 * Created by edgardo on 11/7/2016.
 */

module.exports =  function (connection, mongoose, service) {
    let mailingSchema  = {
        "from" : {
            type: String,
            index: {
                unique: false
            }
        },
        user : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        "to": {
            type: String,
            index:{
                unique: false
            }
        },
        "subject" : {
            type: String,
            index: {
                unique: false
            }
        },
        "template":  {
                type: String,
            index: {
                    unique:false
                }
        },
        "body" : {
            type: String,
            index: {
                unique: false
            }
        },
        "textVersion":{
          type: String
        },
        "created_at" : {
            type: Date,
            index: {
                unique: false
            },
            default: Date.now
        },
        "try_send_at" : {
            type: Date,
            index: {
                unique: false
            },
            default: Date.now
        },
        "sent_at" : {
            type: Date,
            index: {
                unique: false
            },
            default: new Date(0)
        },
        "error": {
                "error_at": {
                    type: Date,
                    index: {
                        unique: false
                    }
                },
                "message": {
                    type: String,
                    index: {
                        unique: false
                    }
                }
        }
    };

    return connection.model('mailings', mailingSchema);
};