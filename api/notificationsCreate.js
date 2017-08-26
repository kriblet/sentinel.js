
module.exports = function(service) {
    return {
        type: 'post', // get by default
        middleware:
        service.security.httpMiddleware, // none by default
        params:
            [], // none by default
        worker:

            function (req, res, next) {
                res.json({
                    isValid: false,
                    error: err.message
                })
            }
    };
};