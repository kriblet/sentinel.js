/**
 * Created by Ben on 02/06/2017.
 */
const express           = require("express"),
    Security            = require(`${__dirname}/security`),
    io                  = require("socket.io"),
    app                 = express(),
    http                = require('http'),
    compression         = require('compression'),
    bodyParser          = require("body-parser"),
    server              = http.createServer(app),
    os                  = require('os'),
    fs                  = require('fs'),
    conf                = require(`${__dirname}/../../config`),
    data                = require(`${__dirname}/../../data`),
    _                   = require('lodash'),
    connectors =        new data.Connector(conf.development.db /* db configuration for development */);


/**
 * Service application to listen all users providing an idle connection until they got any kind of notifications.
 */
class ServiceApplication {
    constructor(config = null){
        this.app = app;
        this.config(config);
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
            self.mongoConnector = connectors.connectors.mongodb;
            self.mongoConnector.connect()
                .then(() => {
                    /*Prepares all models existing in folder models... with extension of name sql / mongodb */
                    data.Models.prepare(connectors.connectors, self)
                        .then((models) => {
                            /* This models are available as the example in tests
                             *
                             users = self.models.sql.users;
                             notifications = self.models.mongodb.notifications;
                             * */
                            self.models = models;
                            self.security = new Security();
                            self.security.use(self.models);
                            self.sethttpControllers();
                            self.setIo();
                            /* Starts the app */
                            let port = process.env.PORT || self.config.port || 8081;
                            self.server.listen(port, () => {
                                console.log(`Server ready and listening in ws://${self.hostname}:${port}, 
                                                Admin Panel is in http://${self.hostname}:${port}/${self.config.host.webserverRoute}`);
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
        let self = this;

        self.io = io.listen(self.server);

        // attach events from api to io clients
        let apiFiles = fs.readdirSync(`${__dirname}/api`),
            apiControllers = [];
        apiFiles.forEach((apiFile)=>{
            /*requires each api controller in directory*/
            apiControllers.push(require(`${__dirname}/api/${apiFile}`)(self));
        });

        if (self.config.directories.controllers){
            let customApiFiles = [];
            if (self.config.directories.controllers.constructor === Array){
                self.config.directories.controllers.forEach((customApiRoute)=>{
                    customApiFiles.push({route: customApiRoute, files: fs.readdirSync(customApiRoute)});
                })
            }else{
                customApiFiles.push({route: self.config.directories.controllers, files: fs.readdirSync(self.config.directories.controllers)});
            }
            customApiFiles.forEach((customController)=>{
                customController.files.forEach((customControllerFile)=>{
                    apiControllers.push(require(`${customController.route}/${customControllerFile}`)(self));
                })
            });
        }

        // security middleware
        self.io.use(self.security.middleware);
        self.connections = {};
        /* What to do if some user is connected? */
        self.io.sockets.on('connection', function (client) {
            if (client.user && client.user.me) {
                if (!self.connections[client.user.me._id]){
                    self.connections[client.user.me._id] = [];
                }
                self.connections[client.user.me._id].push(client);
            }
            /*for each controller registered in api, attach the event and worker*/
            apiControllers.forEach((apiController)=>{
                if (apiController.constructor === Array){
                    apiController.forEach((apiConrollerMember)=>{
                        if (!client.user && !client.user.me && !apiConrollerMember.public) {
                            return;
                        }
                        client.on(apiConrollerMember.event, (args, ack)=> {
                            if (client.user && client.user.me) {
                                console.log("User authenticated");
                                client.user.session.validAt = new Date();
                                client.user.session.save((err)=>{console.log("update session",err)});
                            }
                            apiConrollerMember.worker(args, ack);
                        });
                    })
                }else {
                    if (!client.user && !client.user.me && !apiController.public) {
                        return;
                    }
                    client.on(apiController.event, (args, ack)=> {
                        if (client.user && client.user.me) {
                            console.log("User authenticated");
                            client.user.session.validAt = new Date();
                            client.user.session.save((err)=>{console.log("update session",err)});
                        }
                        apiController.worker(args, ack);
                    });
                }
            });

            if (client.user && client.user.me) {
                let _me = client.user.me.toObject();
                _me.password = '****';

                client.emit('welcome', {isValid: true, user: _me, session: client.user.session.toObject()});
            }

            client.on('disconnect', () => {
                if (client.user && client.user.me) {
                    _.remove(self.connections[client.user.me._id], function (currConnection) {
                        return currConnection.id === client.id;
                    });
                }
                client.disconnect();
            });
        });
    }

    sethttpControllers(){
        let self = this;
        if (!self.config.directories.httpControllers){
            return;
        }

        self.config.directories.httpControllers.forEach((apiRoute)=>{
            let apiFiles = fs.readdirSync(`${apiRoute}`);
            apiFiles.forEach((apiFile)=>{
                if (apiFile.indexOf('.js') === -1){
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
                    console.log('added=>',endpoints);
                    self.app[httpControllersController.type](endpoints, httpControllersController.middleware || null, httpControllersController.worker);
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

