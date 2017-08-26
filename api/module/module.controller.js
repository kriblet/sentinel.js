/**
 * Created by Ben on 04/07/2017.
 */



module.exports = function(service){
    return {
        find: require('./moduleFind.js')(service)
    };
};