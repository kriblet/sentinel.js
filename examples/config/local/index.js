/**
 * Created by Ben on 28/06/2017.
 */


module.exports = {
    /* This appName is the name which the application will be stored in pm2 apps list */
    appName: 'testName',

    /* log output level, available with service.logger.LOG_LEVEL(message) */
    logLevel: 'debug' || 'info' || 'warn' || 'error',

    /* allowed domains to connect to this application, no CORS available. always trusted incoming requests */
    allowedDomains: ['localhost','c9users.io','desktop-ip4vcb7'],

    /* host configuration */
    host: {
        port: 80,
        cors: true, // set up cors to true if u don't wanna use allowedDomains
        poweredBy: '' // SentinelJs default, helps us to get more users ;). but you can always change it.
    },


    db: {
        mongodb: {
            engine: 'mongodb',
            host: '127.0.0.1',
            port: 27017,
            database: 'test_ludens'
        }
    },
    webServer:{
        path: ``, // path of the web server files / static or express
        route: '' // route of the "/" suffix application
    },

    controllers: {
        /* realtime controllers, has to have .realtime extension */
        realtime: [],
        /* http rest api controllers, must have .controller extension */
        http: []
    },
    /* models can be from any database including the following */
    /* mysql, mssql, postgresql, sqlite | engine : "sql"  */
    /* mongodb | engine: 'mongodb' */
    /* dynamodb | engine: 'dynamodb' */
    models:{
        mongodb: [ ]
    },

    security:{
        sessionExpiresMinutes: 30,
        /*Disable frame embedding (recommended)*/
        disableFrameEmbedding: true,
        /*Enable XSS filter (recommended)*/
        enableXssFilter: true,
        /*Disables MIME sniffer (recommended)*/
        disableMimeSniffing: true,
        /*Disables Internet Explorer compatibility (up to you)*/
        disableIeCompatibility: false,
        /* allow custom headers */
        allowedHeaders: []
    },
    usersExtend: '', // file that contains the fields to extend users model  (mongoose only supported)
    plugins: [`${__dirname}/../../plugins/sentinel-oAuth2`]
};

