/**
 * Created by Ben on 26/05/2017.
 */

const should = require("should"),
    data = require(__dirname + '/..'),
    conf = require('../../config'),
    _ = require("lodash"),
    errorHandler = (err)=>{console.error(err);};

const newUserdata = {
        name: 'Ben',
        lastName: 'Benavides',
        email: 'enriquebenavidesm@gmail.com',
        password: 'somepass'
    };


describe("PeopleMovers data Models", () => {
    describe("Happy path", () => {
        let connectors = null,
            mongoConnector = null,
            sqlConnector = null,
            users = null,
            notifications = null,
            newUser = null,
            newNotification = null,
            models = null;

        before((done) => {
            connectors = new data.Connector(conf.development.db /* db configuration for development */);
            mongoConnector = connectors.connectors.mongodb;
            mongoConnector.connect()
                .then(() => {
                    done();
                })
                .catch(errorHandler);
        });

        it("Should get each model object from sql and mongodb", (done) => {
            data.Models.prepare(connectors.connectors)
                .then((models) => {
                    models.mongodb.should.be.ok();
                    users = models.mongodb.users;
                    done();
                })
                .catch((err)=>{
                    console.log("ERR GET", err);
                    done();
                });
        });


        it("Should save an object MongoDB", (done) => {
            newUser = users(newUserdata);
            newUser.save((err) => {
                if (err){
                    console.log("ERR SAVE",err);
                }else {
                    newUser.name.should.be.equal("Ben");
                }
                done();
            });

        });

        it("Should retrieve new saved object MongoDB", (done) => {
            users.findById(newUser._id)
                .then((result) => {
                    result.should.be.ok();
                    result.name.should.be.equal("Ben");
                    done();
                })
                .catch((err)=>{
                    console.log("ERR FIND", err);
                    done();
                });

        });

        it("Should modify new saved object MongoDB", (done) => {
            newUser.name = "Ben 002";
            newUser.save()
                .then(() => {
                    newUser.name.should.be.equal("Ben 002");
                    done();
                })
                .catch((err)=>{
                    console.log("ERR MODIFY", err);
                    done();
                });
        });

        it("Should delete new saved object MongoDB", (done) => {
            newUser.remove((err)=>{
                if (err){
                    console.error(err);
                    done();
                }else{
                    true.should.be.equal(true);
                    done();
                }
            });

        });

        after((done) => {
            mongoConnector.getConnection().close();
            done();
        });
    });

    describe("Bad Parameters Queries", () => {
        let connectors = null,
            mongoConnector = null,
            sqlConnector = null,
            users = null,
            notifications = null,
            newUser = null,
            newNotification = null;

        before((done) => {
            connectors = new data.Connector(conf.development.db /* db configuration for development */);
            mongoConnector = connectors.connectors.mongodb;
            mongoConnector.connect()
                .then(() => {
                    users = require(__dirname + '/../src/models/mongodb/users')(mongoConnector.getConnection(), data.Connector.mongoose);
                    done();
                })
                .catch(done);
        });

        it("Should throw error after trying to save an object with not nullable property MongoDB", (done) => {
            newUser = users({});
            newUser.save()
                .then(() => {
                    done();
                })
                .catch((err) => {
                    err.message.should.be.equal("users validation failed: password: Path `password` is required., email: Path `email` is required., lastName: Path `lastName` is required., name: Path `name` is required.");
                    done();
                })
        });
        it("Should find 0 records from MongoDB users document", (done) => {
            users.find({name: null})
                .then((result) => {
                    result.length.should.be.equal(0);
                    done();
                })
                .catch(errorHandler);
        });

        after((done) => {
            mongoConnector.getConnection().close();
            done();
        });
    })

});
