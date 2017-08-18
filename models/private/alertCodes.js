/**
 * Created by ben on 04/03/2016.
 */
module.exports =  function(connection, mongoose, service){
    let alertCodesSchema = {
        code: {
            type: String,
            index: {
                unique: true
            },
            required:true},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        active: {type: Boolean, default: true},
        created_at: {type: Date, default: Date.now}
    };

    return connection.model('alertCodes', alertCodesSchema);
};