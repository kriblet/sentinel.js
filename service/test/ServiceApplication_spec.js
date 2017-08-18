/**
 * Created by Ben on 29/05/2017.
 */


const should                = require('should'),
    async                   = require('async'),
    conf                    = require('../../config').development,
    ServiceApplication      = require(`${__dirname}/..`),
    emulator                = require(`${__dirname}/../emulator`);

const errorHandler = (err)=>{
    console.error(err);
};

describe("ServiceApplication class test",()=>{
    describe("Happy Path",()=>{
        let app = null;

        before((done)=>{
            app = new ServiceApplication(conf);
            app.should.be.ok();
            app.start()
                .then(()=>{
                    done();
                })
                .catch(errorHandler)
        });

        it (`should start listening on port ${conf.host.port}`,(done)=>{
            app.status.should.be.equal("Running");
            done();
        });

        it ("should accept new connections passing security",(done)=>{
            let emu = new emulator({
                url: `http://localhost:${conf.host.port}`,
                username: "enriquebenavidesm@gmail.com",
                password: "somepass",
                app: "5938944d84c88f1be8064841", // web
                //"5938944d84c88f1be8064843" // iOs
                //"5938944d84c88f1be8064842" // Android
                reconnection: false,
                forceNew: true
            });
            emu.on("connect",()=>{
                try{
                    done();
                }catch(err){}
            });
            emu.on("notify",(notification)=>{
                console.log("notify", notification);
                emu.emit('ack', 'ok', function (data) {
                    console.log(data);
                });
            });
            emu.connect();
        });

        it (`should broadcast a message`,(done)=>{
            app.broadcast("notify","Message");
            setTimeout(done,1000);
        });

        after((done)=>{
            app.stop()
                .then(done).catch(errorHandler);
        })
    });

    describe("Bad parameters test",()=>{
        let app = null;
    });
});