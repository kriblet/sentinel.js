/**
 * Created by Ben on 26/05/2017.
 */

'use strict';

const Sequelize = require("sequelize"),
    ConnectorTypes = require(__dirname + '/../common/ConnectorTypes'),
    ConnectorBase = require(__dirname + '/../common/ConnectorBase');

class SqlConnector extends ConnectorBase{
    /**
     * Constructor, args are the configuration parameters.
     * @param args
     */
    constructor(args){
        super(args);

        this.connection = new Sequelize(args.database, args.username, args.password, {
            host: args.host,
            dialect: args.engine, // 'mysql'|'sqlite'|'postgres'|'mssql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            logging: false
            // SQLite only
            //storage: 'path/to/database.sqlite'
        });
        this._type = ConnectorTypes.sql;
    }

    /**
     * gets default connection
     * @returns {Sequelize|null}
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
        return this.connection.authenticate();
    }

    /**
     * Gets actual SQL connection
     * @returns {Sequelize|null}
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

module.exports = SqlConnector;