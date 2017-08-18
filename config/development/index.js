/**
 * Created by Ben on 28/06/2017.
 */


module.exports = {
    allowedDomains: ['localhost','c9users.io','xentinel.io','desktop-ip4vcb7'],
    host: {
        webserverRoute: 'app',
        port: 8081,
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
        webApp: `${__dirname}/../../webapp`,
        httpControllers: [`${__dirname}/../../api`],
        models:{
            mongodb: [ `${__dirname}/../../models/private`, `${__dirname}/../../models/public` ]
        },
        controllers: [`${__dirname}/../../modules/users`,`${__dirname}/../../modules/history`]
    }
};
