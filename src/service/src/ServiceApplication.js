/**
 * Created by Ben on 02/06/2017.
 */
const express           = require("express"),
    bootstrapper        = require(__dirname + '/modules/bootstrap'),
    loader              = require(`${__dirname}/modules/loaders`),
    app                 = express(),
    http                = require('http'),
    server              = http.createServer(app),
    os                  = require('os'),
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
        this.server = server;
        this.hostname = os.hostname();
        this.express = express;
        this.config(options.config);
    }

    /**
     * Configures the service to run with defined parameters
     * @param config
     */
    config(config = null){
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
                    /**
                     * handler for incoming requests.
                     */
                    self.setHandler();

                    /* Starts the app */
                    let port = process.env.PORT || self.config.host.port || 8081;
                    self.server.listen(port, () => {
                        console.log(`SentinelJs listening at http://${self.hostname}:${port}/${self.config.host.webServerRoute}`);
                        self.status = "Running";
                        resolve();
                    });

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

