/**
 * Created by Ben on 02/06/2017.
 */
const express           = require("express"),
    ioHandler           = require(`${__dirname}/modules/ioHandler`),
    Security            = require(`${__dirname}/modules/security`),
    app                 = express(),
    http                = require('http'),
    compression         = require('compression'),
    bodyParser          = require("body-parser"),
    server              = http.createServer(app),
    os                  = require('os'),
    fs                  = require('fs'),
    data                = require(`${__dirname}/../../data`),
    _                   = require('lodash');



/**
 * Service application to listen all users providing an idle connection until they got any kind of notifications.
 */
class ServiceApplication {
    constructor(options = null){
        this.app = app;
        this.config(options.config);
        this.server = server;
        this.hostname = os.hostname();
    }

    /**
     * Configures the service to run with defined parameters
     * @param config
     */
    config(config = null){
        let self = this;

        if (!config){
            throw new Error("Configuration is not set for Service Application");
        }
        self.config = config;
        /* Express api app configuration*/
        self.app.use( compression()) ;
        self.app.use( bodyParser.json() );
        self.app.use( bodyParser.urlencoded({"extended": false}) );

        self.app.use(`/${self.config.host.webserverRoute}`, express.static(self.config.directories.webApp));

        /* Set default headers for express api app */
        self.app.use(function (req, res, next) {
            res.header('X-Powered-By', "Xentinel");
           next();
        });
    }

    /**
     * Starts the service pre-configured in constructor.
     */
    start(){
        let self = this;
        return new Promise((resolve,reject)=> {
            /*Connects to mongodb database (name of db config)*/
            self.connectors =        new data.Connector(self.config.db /* db configuration for development */);

            self.mongoConnector = self.connectors.connectors.mongodb;
            self.mongoConnector.connect()
                .then(() => {
                    if (self.config.usersEngine || true) {
                        self.config.directories.models.mongodb.push(`${__dirname}/modules/users/models`);
                    }
                    /*Prepares all models existing in folder models... with extension of name sql / mongodb */
                    data.Models.prepare(self.connectors.connectors, self)
                        .then((models) => {
                            /* This models are available as the example in tests
                             *
                             users = self.models.sql.users;
                             notifications = self.models.mongodb.notifications;
                             * */
                            self.models = models;
                            self.security = new Security(self);
                            self.security.use(self.models);
                            self.setHttpControllers();
                            self.setIo();
                            /* Starts the app */
                            let port = process.env.PORT || self.config.port || 8081;
                            self.server.listen(port, () => {
                                console.log(`Server ready at http://${self.hostname}:${port}/${self.config.host.webserverRoute}`);
                                self.status = "Running";
                                resolve();
                            });

                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }


    /**
     *  set up all needed configuration for socket io.
     */
    setIo(){
        ioHandler(this);
    }

    setHttpControllers(){
        let self = this;
        self.existingRoutes = {};

        if (!self.config.directories.httpControllers){
            return;
        }
        self._setHttpControllers(self.config.directories.httpControllers);
    }

    _setHttpControllers(directories){
        let self = this;
        directories.forEach((apiRoute)=>{
            let apiFiles = fs.readdirSync(`${apiRoute}`);
            apiFiles.forEach((apiFile)=>{
                if (apiFile.indexOf('.js') === -1){
                    return self._setHttpControllers([`${directories}/${apiFile}`]);
                }
                if (apiFile.indexOf('.controller') === -1){
                    return;
                }

                /*requires each http api controller in directory*/
                let endpointBase = '/' + apiFile.replace('.js','');
                let httpControllersControllers = require(`${apiRoute}/${apiFile}`)(self);
                Object.keys(httpControllersControllers).forEach((key)=>{
                    let endpoints = [];
                    let httpControllersController = httpControllersControllers[key],
                        params = httpControllersController.params;
                    if (params && params.constructor === Array && params.length > 0){
                        params.forEach(function(param){
                            if (param.constructor === Array){
                                endpoints.push(endpointBase + '/' + key + '/:' + param.join('/:'));
                            }else{
                                endpoints.push(endpointBase + '/' + key + '/:' + param);
                            }
                        })
                    }else if(params && params.constructor === Array && params.length === 0){
                        endpoints.push(endpointBase + '/' + key);
                    }else if(params){
                        endpoints.push(endpointBase + '/' + key + '/:' + params);
                    }

                    if (!self.existingRoutes[httpControllersController.type || 'get']){
                        self.existingRoutes[httpControllersController.type || 'get'] = [];
                    }else{
                        let found = _.intersection(self.existingRoutes[httpControllersController.type || 'get'], endpoints);
                        if (found){
                            throw new Error(`Routes already defined ${found.join(" | ")}` );
                        }
                    }
                    self.existingRoutes[httpControllersController.type || 'get'] = self.existingRoutes[httpControllersController.type || 'get'].concat(endpoints);
                    self.app[httpControllersController.type || 'get'](endpoints, httpControllersController.middleware || null, httpControllersController.worker);
                });
            });
        });
    }

    broadcast(_event, _data){
        let self = this;
        return self.io.emit(_event, _data);
    }
    /**
     * Stops the server
     * @returns {Promise}
     */
    stop(){
        let self = this;
        return new Promise((resolve, reject)=>{
            self.sqlConnector.getConnection().close();
            self.mongoConnector.getConnection().close();
            self.connections.forEach(function(client) {
                client.disconnect();
            });
            self.status = "Stopped";
            resolve();
        });

    }

    setHandler(){
        let self = this;
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
                headers['X-Powered-By'] = "Kriblet";

                headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
                headers['Access-Control-Allow-Headers'] = 'origin, X-Requested-With, Content-Type, Accept, Content-Length, x-app-id, x-session-id';
                res.writeHead(200, headers);
                res.end();
            } else {
                listeners.forEach(function(fn) {
                    fn.call(srv, req, res);
                });
            }
        });
    }

}


module.exports = ServiceApplication;

