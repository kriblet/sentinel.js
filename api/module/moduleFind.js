
module.exports = function(service) {
    return {
        middleware: service.security.httpMiddleware, // none by default
        worker: function (req, res, next) {
                res.json({
                    isValid: false,
                    error: err.message
                })
            }
    };
};