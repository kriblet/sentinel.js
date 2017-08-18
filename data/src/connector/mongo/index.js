/**
 * Created by Ben on 26/05/2017.
 */
'use strict';

const mongoose = require("mongoose"),
    ConnectorTypes = require(__dirname + '/../common/ConnectorTypes'),
    ConnectorBase = require(__dirname + '/../common/ConnectorBase');

class MongoConnector extends ConnectorBase{
    /**
     * Constructor, args are the configuration parameters.
     * @param args
     */
    constructor(args){
        super(args);
        this.connection = mongoose.createConnection();
        this.options = args;
        this._type = ConnectorTypes.mongodb;
    }

    /**
     * gets default connection
     * @returns {Connection|*|null}
     */
    get(){
        return this.getConnection();
    }


    /**
     * Connection method. This will return a promise.
     * @returns {Promise<void>}
     */
    connect(){
        let options = {
            server: {
                auto_reconnect: true
            },
            uri_decode_auth: true
        };
        return this.connection.open(`mongodb://${this.options.username ? this.options.username + ':' + this.options.password + '@' : ''}${this.options.host}:${this.options.port}/${this.options.database}?authSource=admin`,options);
    }

    /**
     * returns actual Mongo connection
     * @returns {Connection|*|null}
     */
    getConnection(){
        return this.connection;
    }

    /**
     * returns type
     * @returns {ConnectorTypes}
     */
    get type(){
        return this._type;
    }
}

module.exports = MongoConnector;