/**
 * Created by ben on 11/11/2015.
 */
module.exports =  function(connection, mongoose, service){
    let deviceMessagesSchema  = {
        vehicle : {type: mongoose.Schema.Types.ObjectId, ref: 'vehicles'},
        command: {type: mongoose.Schema.Types.ObjectId, ref: 'deviceCommands'},
        user : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        sent: {type:Date, default: null, index: true},
        response: { content: String, received: Date },
        valid: {type: Boolean, default: false},
        active: {type: Boolean, default: true},
        created_at : {
            type: Date,
            default: Date.now,
            index: {
                unique: false
            }}
    };

    return connection.model('deviceMessages',deviceMessagesSchema);
};

