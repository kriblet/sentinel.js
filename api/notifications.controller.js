/**
 * Created by Ben on 04/07/2017.
 */



module.exports = function(service){
    return {
        create: require('./notificationsCreate.js')(service)
    };
};