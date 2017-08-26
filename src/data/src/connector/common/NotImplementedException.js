/**
 * Created by Ben on 26/05/2017.
 */

'use strict';

/**
 * Not implemented exception.
 */
class NotImplementedException{
    constructor(args){
        this.title = args || 'Method is Not implemented';
    }

    /**
     * gets the not implemented exception
     * @returns {Error}
     */
    get(){
        return new Error(this.title);
    }
}

module.exports = NotImplementedException;