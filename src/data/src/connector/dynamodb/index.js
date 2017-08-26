/**
 * Created by Ben on 26/05/2017.
 */
'use strict';

const dynamoose = require("dynamoose"),
    ConnectorTypes = require(__dirname + '/../common/ConnectorTypes'),
    ConnectorBase = require(__dirname + '/../common/ConnectorBase');

class DynamodbConnector extends ConnectorBase{
    /**
     * Constructor, args are the configuration parameters.
     * @param args
     */
    constructor(args){
        super(args);
        this.config = args;
        this._type = ConnectorTypes.dynamodb;
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
     * @param config
     * @returns {Promise<void>}
     */
    connect(config){
        let self = this;
        return new Promise((resolve, reject)=>{
            try {
/*
                this.connection = new AWS.DynamoDB({
                    apiVersion: '2012-08-10',
                    accessKeyId: self.config.accessKeyId,
                    secretAccessKey: self.config.secretAccessKey,
                    endpoint: `https://${self.config.service}.${self.config.region}.amazonaws.com`,
                    service: self.config.service,
                    region: self.config.region
                });
*/

                dynamoose.AWS.config.update({
                    accessKeyId: self.config.accessKeyId,
                    secretAccessKey: self.config.secretAccessKey,
                    region: self.config.region
                });

                this.connection = dynamoose;
                resolve();
            }catch(err){
                reject(err);
            }

        })
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

module.exports = DynamodbConnector;