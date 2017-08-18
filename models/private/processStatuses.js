/**
 * Created by ben on 04/03/2016.
 */

module.exports =  function(connection, mongoose, service){
    let processStatusSchema = {
        chatId: {
            type: String,
            index: {
                unique: false
            },
            required:true},
        processId:  {type: mongoose.Schema.Types.ObjectId, ref: 'processes', required: true},
        step: {type:Number, required:true},
        lastPayload:{type:String},
        status: {type: String, enum:['Pending','Done','Cancelled'], index:{unique:false}},
        created_at: {type: Date, default: Date.now}
    };

    return connection.model('processStatuses', processStatusSchema);
};