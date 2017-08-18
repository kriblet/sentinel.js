/**
 * Created by Ben on 26/05/2017.
 */

const supportedEngines = require(__dirname + '/common/SupportedEngines'),
    ConectorTypes = require(__dirname + '/common/ConnectorTypes'),
    sequelize = require('sequelize'),
    mongoose = require('mongoose');

mongoose.Promise = Promise;

/**
 * represents all the connections available for this module
 * @description
 * All connections available are in connectors
 */
class Connector{
    constructor(config = null){
        if (!config){
            throw new Error("Connector config is undefined.");
        }

        this._connectors = {};


        /**
         * Iterate the config values to check if there is an engine that is not supported
         */
        Object.keys(config).forEach((configName)=>{
            let engine = (config[configName].engine || configName).toLowerCase();
            if (!supportedEngines[configName]){
                throw new Error(`Database [${configName}] with engine [${engine}] is not supported.`)
            }
            this._connectors[configName] = new supportedEngines[engine](config[configName]);
            this._connectors[configName].name = configName;
        });

    }

    /**
     * gets all current registered Connectors
     * @returns {{}|*}
     */
    get connectors(){
        return this._connectors;
    }

    /**
     * returns specific connector
     * @param connectorName
     * @returns {*|null}
     */
    getConnector(connectorName){
        return this._connectors[connectorName] || null;
    }


    /**
     * gets sequelize class
     * @returns {Sequelize}
     */
    static get sequelize(){
        return sequelize;
    }

    /**
     * gets mongoose class
     * @returns {"mongoose"}
     */
    static get mongoose(){
        return mongoose;
    }

    static get ConnectorTypes(){
        return ConectorTypes;
    }
}

module.exports = Connector;