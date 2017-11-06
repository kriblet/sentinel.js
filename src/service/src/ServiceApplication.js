/**
 * Created by Ben on 02/06/2017.
 */
const express           = require("express"),
    app                 = express(),
    http                = require('http'),
    server              = http.createServer(app),
    os                  = require('os'),
    logger              = require(`${__dirname}/modules/logger`),
    bootstrapper        = require(`${__dirname}/modules/bootstrap`),
    loader              = require(`${__dirname}/modules/loaders`),
    _                   = require('lodash');





/**
 * Service application
 */
class ServiceApplication {
    constructor(options = null){

        this.app = app;

        /* logger set up */
        this.logger = logger;
        this.logger.transports.console.level = options.config.logLevel ;
        this.logger.transports.file.level = options.config.logLevel ;
        /* attach logger to express app */
        this.logger.attach(this);

        /* server set up */
        this.server = server;
        this.hostname = os.hostname();
        this.express = express;

        /* whole app configuration */
        this.config(options.config);
    }

    /**
     * Configures the service to run with defined parameters
     * @param config
     */
    config(config = null){
        /* bootstrap the app */
        bootstrapper.config(this, config);
        bootstrapper.security(this);
    }

    /**
     * Starts the service pre-configured in constructor.
     */
    start(){
        let self = this;
        return new Promise((resolve,reject)=> {
            bootstrapper.connections(self)
                .then(function(){
                    self.setHttpControllers();
                    self.setIo();
                    bootstrapper.plugins(self)
                        .then(function(plugins){
                            /* plugins exposure to all Service */
                            self.plugins = plugins;
                            bootstrapper.webServer(self)
                                .then(()=>{
                                    /* sets the custom request handler */
                                    self.setHandler();

                                    /* Starts the app */
                                    let port = process.env.PORT || self.config.host.port || 8081;
                                    self.server.listen(port, () => {
                                        if (self.config.webServer && self.config.webServer.path) {
                                            self.logger.info(`SentinelJs Web Server listening at http://${self.hostname}:${port}/${self.config.webServer.route}`);
                                        }
                                        self.logger.info(`SentinelJs Application listening at http://${self.hostname}:${port}/`);
                                        self.status = "Running";
                                        resolve();
                                    });
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
            Object.keys(self.io.connections).forEach(function(clientId) {
                self.connections.io[clientId].forEach((client)=>{
                    client.disconnect();
                });
            });
            Object.keys(self.connections).forEach((connId)=> {
                self.connections[connId].close();
            });
            self.status = "Stopped";
            self.logger.info("Service Stopped Successfully");
            resolve();
        });
    }
}


module.exports = ServiceApplication;

