module.exports =  function(connection, mongoose, service) {
    let bankSchema = mongoose.Schema({
        title: { type: String, required: true },
        oauth_id: { type: Number, unique: true },
        oauth_secret: { type: String, unique: true, default: function() {
            return uid(42);
        }
        },
        domains: [ { type: String } ]
    },{
        timestamps: true
    });

    return {
        model: connection.model('Bank', bankSchema),
        public: false
    };
};