/**
 * Created by ben on 04/03/2016.
 */
module.exports =  function(connection, mongoose, service){
    let privateSchema = {
        name: String,
        private: Boolean
    };

    return {
        model: connection.model('private', privateSchema),
        public: false
    };
};