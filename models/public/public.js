/**
 * Created by ben on 09/11/2015.
 */
module.exports =  function(connection, mongoose, service) {
    let publicSchema = new mongoose.Schema({
        name: String,
        public: Boolean
    });

    return {
        model: connection.model('public', publicSchema),
        public: true
    }
};