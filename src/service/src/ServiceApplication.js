/**
 * Created by Ben on 02/06/2017.
 */
const express           = require("express"),
    loader              = require(`${__dirname}/modules/loader`),
    Security            = require(`${__dirname}/modules/security`),
    app                 = express(),
    http                = require('http'),
    compression         = require('compression'),
    bodyParser          = require("body-parser"),
    server              = http.createServer(app),
    os                  = require('os'),
    fs                  = require('fs'),
    data                = require(`${__dirname}/../../data`),
    winston             = require('winston'),
    _                   = require('lodash');

const logger = new (winston.Logger)({
    levels: {
        'info': 0,
        'debug': 1,
        'warn': 2,
        'error': 3
    },
    colors: {
        'info': 'cyan',
        'debug': 'gray',
        'warn': 'yellow',
        'error': 'red'
    },
    transports: [
        new (winston.transports.Console)({
            colorized: true,
            timestamp: true
        }),
        new (winston.transports.File)({
            filename: 'sentinel.log'
        })
    ]
});



/**
 * Service application to listen all users providing an idle connection until they got any kind of notifications.
 */
class ServiceApplication {
    constructor(options = null){
        this.logger = logger;
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

        self.logger.level = self.config.logLevel;

        self.logger.info('Adding configuration');

        /* Express api app configuration*/
        self.app.use( compression()) ;
        self.app.use( bodyParser.json() );
        self.app.use( bodyParser.urlencoded({"extended": false}) );

        if (self.config.directories.webApp) {
            self.app.use(`/${self.config.host.webServerRoute}`, express.static(self.config.directories.webApp));
            self.logger.info(`Adding static routes for ${self.config.directories.webApp}`);
        }

        /* Set default headers for express api app */
        self.app.use(function (req, res, next) {
            res.header('X-Powered-By', "SentinelJS");
            if (self.config.security.disableFrameEmbedding){
                Security.disableFrameEmbedding(res);
            }
            if (self.config.security.disableMimeSniffing){
                Security.disableMimeSniffing(res);
            }
            if (self.config.security.enableXssFilter){
                Security.enableXssFilter(res);
            }
            if (self.config.security.disableIeCompatibility){
                Security.disableIeCompatibility(res);
            }
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

            let promises = [];
            Object.keys(self.connectors.connectors).forEach((conn)=>{
                promises.push(conn.connect);
            });

            Promise.all(promises)
                .then(() => {
                    if (self.config.usersEngine || true) {
                        if (!self.config.directories.models.mongodb){
                            throw new Error("No mongodb database available.");
                        }
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
                            self.dataConnectors = {};
                            Object.keys(self.connectors.connectors).forEach((connId)=> {
                                self.dataConnectors[connId] = self.connectors.connectors[connId].getConnection();
                            });

                            self.models = models;
                            self.security = new Security(self);
                            self.security.use(self.models);
                            self.setHttpControllers();
                            self.setIo();
                            self.setHandler();
                            /* Starts the app */
                            let port = process.env.PORT || self.config.port || 8081;
                            self.server.listen(port, () => {
                                console.log(`Server listening at port ${port} \nWebServer listening at http://${self.hostname}:${port}/${self.config.host.webServerRoute}`);
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
        loader.ioLoader(this);
    }

    /**
     * Raise up all RestApi Services
     */
    setHttpControllers(){
        loader.restApiLoader(this);
    }

    /**
     * Request hack for proxies
     */
    setHandler(){
        loader.requestLoader(this);
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
            Object.keys(self.connections).forEach(function(clientId) {
                self.connections[clientId].forEach((client)=>{
                    client.disconnect();
                });
            });
            Object.keys(self.dataConnectors).forEach((connId)=> {
                self.dataConnectors[connId].close();
            });
            self.status = "Stopped";
            console.log("Service Stopped Successfully");
            resolve();
        });
    }
}


module.exports = ServiceApplication;

