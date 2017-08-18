/**
 * Created by Ben on 04/07/2017.
 */



module.exports = function(service){
    let api = {
        create: {
            type: 'post',
            middleware: service.security.httpMiddleware,
            params: [],
            worker: function(req,res,next){
                res.json({
                    isValid: false,
                    error: err.message
                })
            }
        }
    };

    return api;
};