/**
 * Created by Ben on 10/06/2017.
 */


module.exports = (service)=>{

    return [{
        /**
         * Event getUserByTag finds an existent user and return back if found
         */
        event: 'login',
        worker: (args, ack)=> {
            return ack({
                isValid: false,
                error: new Error('Test')
            })
        },
        public: true
    }]

};