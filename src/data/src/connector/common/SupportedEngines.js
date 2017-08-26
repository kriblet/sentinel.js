/**
 * Created by Ben on 26/05/2017.
 */

'use strict';

/**
 * all supported database engines
 */
class SupportedEngines{
    /**
     * NoSQL engines
     */
    static get mongodb() {return require(__dirname + "/../mongo");};

    static get dynamodb() { return require(__dirname + "/../dynamodb")}

    /**
     * SQL engines
     */
    static get postgresql() {return  require(__dirname + "/../sql");};
    static get mysql() {return  require(__dirname + "/../sql");};
    static get sqlite() {return  require(__dirname + "/../sql");};
    static get mssql() {return  require(__dirname + "/../sql");};

}

module.exports = SupportedEngines;