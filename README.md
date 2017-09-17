# sentinel.js
This is a NodeJs framework for codesmiths who are tired of messy frameworks, this framework helps developers to ensure their app run as they want and its easy to configure and install.
Actually it needs only a few steps to get your web app working, this includes **RestFul** api services and **Socket.io** services for realtime processing which is RestFul style also.

## Get started

#### How to install
```bash
npm install sentineljs -g
```

#### How to configure
It works with separation of concerns principle, uses modularity and involves several frameworks to work with.
```javascript
module.exports = {
    // if cors is enabled we will need this middleware to be sure that no other domains consumes our api or web.
    allowedDomains: ['localhost'],

    // hosting configuration
    host: {
        // route prefix for our web server pages.
        webServerRoute: 'local',
        // port in whicn our app will listen
        port: 8080,
        // allows cross origins request. between domains in the previous configuration
        crossOrigin: true
    },
    //supports mongodb / sql (mysql, aurora, mariadb, postgresql, mssql / dynamodb
    //multi database instances
    db: {
        // default mongodb connection data.
        mongodb: {
            engine: 'mongodb',
            host: 'localhost',
            port: 27017,
            database: 'test',
            //optional
            username: '',
            password: ''
        },
        // default mysql connection data
        sql:{
              engine: 'sql',
              host: 'localhost',
              port: 3306,
              database: 'test',
              //optional
              username: '',
              password: ''
        },
        // custom connection data
        custom:{
           engine: 'sql',
           host: 'localhost',
           port: 3306,
           database: 'test2',
           //optional
           username: '',
           password: ''
        }
    },
    directories:{
        // we need full path to get the files
        webApp: `${__dirname}/../../hello-world`, //in case of web server
        // api controllers path
        httpControllers: [`${__dirname}/../../api`], // in case of restapi
        // models path (models style mongoose or sequelize)
        models:{
            mongodb: [ `${__dirname}/../../models/private`, `${__dirname}/../../models/public` ]
        },
         // realtime controllers
        controllers: [`${__dirname}/../../modules/users`,`${__dirname}/../../modules/history`]
    },
    // this users engine contains middleware & login / register / delete restful and socket methods.
    usersEngine: true, // default true (it includes login) this uses mongodb as default database for now.
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
    usersExtend: '' // file that contains the fields to extend users model  (mongoose only supported)
};

```

#### note:
you can copy hello-world project to run it and test it.
https://github.com/kriblet/sentineljs-skeleton

### How to run my app
```bash
sentinel start
```

#### Restarting my app
```bash
sentinel restart
```

#### Removing my app
```bash
sentinel remove
```

#### Help
```bash
sentinel help
```
