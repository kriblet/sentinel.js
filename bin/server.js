/**
 * Created by Ben on 08/06/2017.
 */

const conf                  = require(`${__dirname}/../config`),
    ServiceApplication      = require(`${__dirname}/../service`);


let debug = false;
process.argv.forEach(function (val, index, array) {
    if (val.indexOf('--debug') > -1){
        debug = true;
    }
});
let _conf = null;
if (!debug) {
    _conf = conf.production;
}else{
    _conf = conf.development;
    _conf.debug = true;
}


module.exports = {
    start: function(){
        let app = new ServiceApplication(_conf);
        app.start()
            .then(()=>{
                console.log("Done");
            })
            .catch((err)=> {
                console.log(err);
            });
    }
};