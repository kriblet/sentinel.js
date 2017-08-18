/**
 * Created by Ben on 26/05/2017.
 */

'use strict';

const Conf = require('../../config'),
    runConfs = [];

let _separate = false;

if (process.argv.indexOf('--beta') > -1){
    runConfs.push(Conf.beta);
    _separate = true;
}else if (process.argv.indexOf('--production') > -1){
    runConfs.push(Conf.production);
    _separate = true;
}else {
    runConfs.push(Conf.development);
}

let SequelizeAuto = require('sequelize-auto');
runConfs.forEach((confObject)=>{
    Object.keys(confObject.db).forEach((configName)=>{

        let conf = confObject.db[configName];

        if (conf.engine.toLowerCase() !== 'mysql'){
            return;
        }
        console.log("running");
        let auto = new SequelizeAuto(conf.database, conf.username, conf.password, {
            host: conf.host,
            dialect: conf.engine,
            directory: `${__dirname}/../src/models/sql/${_separate ? configName + '/' : ''}`, // prevents the program from writing to disk
            port: conf.port,
            additional: {
                timestamps: false
                //...
            },
            tables: ['users', 'entitySessInfo', 'hashtags']
            //...
        });

        auto.run(function (err) {
            if (err) throw err;

            process.exit();
        });

    });
});





