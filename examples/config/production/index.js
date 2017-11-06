/**
 * Created by Ben on 28/06/2017.
 */


module.exports = {
    appName: 'testName',
    logLevel: 'info',
    allowedDomains: ['localhost','c9users.io','desktop-ip4vcb7'],
    host: {
        webServerRoute: '',
        port: 80,
        crossOrigin: true
    },
    db: {
        mongodb: {
            engine: 'mongodb',
            host: '127.0.0.1',
            port: 27017,
            database: 'test_ludens'
        }
    },
    directories:{
        webApp: `${__dirname}/../../web/server`, //in case of web server
        httpControllers: [ ], // in case of restapi
        models:{
            mongodb: [ `${__dirname}/../../api/models` ]
        },
        controllers: [
            `${__dirname}/../../api/modules/bank`,
            `${__dirname}/../../api/modules/user`,
            `${__dirname}/../../api/modules/place`
        ]
    },
    // this users engine contains middleware & login / register / delete restful and socket methods.
    usersEngine: false, // default true (it includes login) this uses mongodb as default database for now.
    apps:[
        {
            name: "App Web",
            _id: '5938944d84c88f1be8064841'
        },{
            name: "App Android",
            _id: '5938944d84c88f1be8064842'
        },{
            name: "App iOs",
            _id: '5938944d84c88f1be8064843'
        }
    ],
    security:{
        sessionExpiresMinutes: 30,
        /*Disable frame embedding (recommended)*/
        disableFrameEmbedding: true,
        /*Enable XSS filter (recommended)*/
        enableXssFilter: true,
        /*Disables MIME sniffer (recommended)*/
        disableMimeSniffing: true,
        /*Disables Internet Explorer compatibility (up to you)*/
        disableIeCompatibility: false
    },
    usersExtend: '' // file that contains the fields to extend users model  (mongoose only supported)
};

