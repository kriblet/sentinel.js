
module.exports = function(service){
    let self = service;
    let srv = self.server;
    let listeners = srv.listeners('request').slice(0);
    srv.removeAllListeners('request');
    srv.on('request', function(req, res) {
        if(req.method === 'OPTIONS' && req.url.indexOf('/socket.io') === 0) {
            let headers = {};

            if (req.headers.origin === undefined){
                req.headers.origin = 'chrome-extension://';
            }

            if (req.headers.origin) {
                self.config.allowedDomains.forEach(function (domain) {
                    if (req.headers.origin.indexOf(domain) > -1) {
                        headers['Access-Control-Allow-Origin'] = req.headers.origin;
                        headers['Access-Control-Allow-Credentials'] = 'true';
                    }
                });
            }

            headers['Content-Type'] = "application/json; charset=utf-8";
            headers['X-Powered-By'] = "SentinelJS";

            headers["Access-Control-Allow-Methods"] = "GET,POST,UPDATE,DELETE,OPTIONS";
            headers['Access-Control-Allow-Headers'] = 'origin, X-Requested-With, Content-Type, Accept, Content-Length, x-app-id, x-session-id';
            if (self.config.usersEngine || true) {
                headers['Access-Control-Allow-Headers'] += ', x-app-id, x-session-id';
            }

            res.writeHead(200, headers);
            res.end();
        } else {
            listeners.forEach(function(fn) {
                fn.call(srv, req, res);
            });
        }
    });
};

