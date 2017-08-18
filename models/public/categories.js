    /**
 * Created by VIVO on 18/11/2015.
 */
module.exports =  function(connection, mongoose, service){

    let categorySchema  = {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        name : {
            type: String,
            index: {
                unique: false
            }},
        visibility : {
            type: Number,
            index: {
                unique: false
            }},
        createdAt : {
            type: Date,
            index: {
                unique: false
            },default: Date.now}
    };

    return connection.model('categories',categorySchema);
};