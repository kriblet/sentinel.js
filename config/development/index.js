/**
 * Created by Ben on 28/06/2017.
 */


module.exports = {
    logLevel: 'debug' || 'info' || 'warn' || 'error',
    allowedDomains: ['localhost','c9users.io','xentinel.io','desktop-ip4vcb7'],
    host: {
        webServerRoute: 'app',
        port: 8080,
        crossOrigin: true
    },
    db: {
        mongodb: {
            engine: 'mongodb',
            host: 'localhost',
            port: 27017,
            database: 'test_xentinel2'
        }
    },
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
        sessionExpiresMinutes: 30
    },
    directories:{
        webApp: `${__dirname}/../../hello-world`, //in case of web server
        httpControllers: [`${__dirname}/../../api`], // in case of restapi
        models:{
            mongodb: [ `${__dirname}/../../models/private`, `${__dirname}/../../models/public` ]
        },
        controllers: [`${__dirname}/../../modules/users`,`${__dirname}/../../modules/history`]
    },
    usersEngine: true, // default true (it includes login) this uses mongodb as default database for now.
    usersExtend: '' // file that contains the fields to extend users model
};
