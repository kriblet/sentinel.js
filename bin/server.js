/**
 * Created by Ben on 08/06/2017.
 */

/*
let express = require('express');
let app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
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


let app = new ServiceApplication(_conf);
app.start()
    .then(()=>{
        console.log("Done");
    })
    .catch((err)=> {
        console.log(err);
    });
