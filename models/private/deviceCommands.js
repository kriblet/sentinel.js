/**
 * Created by ben on 11/01/2016.
 */

/**
 * Created by ben on 11/11/2015.
 */
module.exports =  function(connection, mongoose, service){
    let deviceCommandsSchema  = {
        name: {type: String},
        function: {type: String, index:{unique: true}},
        validates: [{adapter:String,expects: String}],
        active: Boolean,
        created_at : {
            type: Date,
            default: Date.now
        }
    };

    return connection.model('deviceCommands',deviceCommandsSchema);
};

