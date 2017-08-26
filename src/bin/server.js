/**
 * Created by Ben on 08/06/2017.
 */


let options = {
    debug: false,
    config: null,
    webServer: false,
    restServer: false,
    realTime: true
};

process.argv.forEach(function (val, index, array) {
    if (val.indexOf('--debug') > -1){
        options.debug = true;
    }
    if (val.indexOf('--config') > -1){
        options.config = require(array[index+1]);
    }
    if (val.indexOf('--web') > -1){
        options.webServer = true;
    }
    if (val.indexOf('--rest') > -1){
        options.restServer = true;
    }
    if (val.indexOf('--realtime') > -1){
        options.realtime = true;
    }
});

const ServiceApplication        = require(`${__dirname}/../service`);
const conf                      = options.config || require(`${__dirname}/../../config`);

let _conf = null;

if (!options.debug) {
    _conf = conf.production;
}else{
    _conf = conf.development;
    _conf.debug = true;
}

options.config = _conf;

module.exports = {
    start: function(){
        let app = new ServiceApplication(options);
        app.start()
            .then(()=>{
                process.on('SIGINT', function() {
                    app.stop()
                        .then(function () {
                            process.exit(0);
                        })
                        .catch((err) => {
                            console.error(err);
                            process.exit(1);
                        })
                });
            })
            .catch((err)=> {
                console.error(err);
            });
    }
};