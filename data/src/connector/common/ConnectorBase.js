/**
 * Created by Ben on 26/05/2017.
 */

'use strict';

const parameters = [
];

const NotImplementedException = require(__dirname + '/NotImplementedException');

/**
 * Base of connectors to extends
 */
class ConnectorBase{
    constructor(args){
        parameters.forEach((parameter)=>{
            if (!args[parameter]){
                throw new Error(`Can not find ${parameter} parameter in database config`)
            }
        });

        this.connection = null;
    }

    /**
     * gets default connection as this
     * @returns {null}
     */
    get(){
        return this.getConnection();
    }

    /**
     * default method connect. is not implemented
     */
    connect(){
        throw new NotImplementedException();
    }

    /**
     * default method getConnection is not implemented.
     */
    getConnection(){
        throw new NotImplementedException();
    }


    /**
     * sets name property
     * @param _value
     */
    set name(_value){
        this._name = _value;
    }

    /**
     * gets name property value
     * @returns {*}
     */
    get name(){
        return this._name;
    }

}

module.exports = ConnectorBase;