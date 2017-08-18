/**
 * Created by Ben on 29/05/2017.
 */

'use strict';

/**
 * Allowed types of connections
 */
class ConnectorTypes{
    /**
     * represents mongodb connection
     * @returns {number}
     */
    static get mongodb() {
        return 1;
    }

    /**
     * represents sql connection
     * @returns {number}
     */
    static get sql() {
        return 2;
    }

    /**
     * represents sql connection
     * @returns {number}
     */
    static get dynamodb(){
        return 3;
    }
}

module.exports = ConnectorTypes;