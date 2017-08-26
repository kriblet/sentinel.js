/**
 * Created by Ben on 26/05/2017.
 */

const should = require("should"),
    data = require(__dirname + '/..'),
    conf = require('../../config'),
    _ = require("lodash"),
    errorHandler = (err)=>{console.error(err);};

describe("PeopleMovers data Connector", () => {
    describe("Happy path", () => {
        let connectors = null,
            dynamodbConnector = null,
            mongoConnector = null,
            sqlConnector = null;

        before((done) => {
            done();
        });

        it("should creates an instance successfully", () => {
            connectors = new data.Connector(conf.development.db /* db configuration for development */);
            connectors.should.be.ok();
        });

        it("should connect to mysql database successfully", (done) => {
            if (connectors.connectors.mysql) {
                sqlConnector = connectors.connectors.mysql;
                sqlConnector.connect()
                    .then(() => {
                        sqlConnector.should.be.ok();
                        done();
                    })
                    .catch(done);
            }else{
                done();
            }

        });

        it("should connect to mongodb database successfully", (done) => {
            mongoConnector = connectors.connectors.mongodb;
            mongoConnector.connect()
                .then(() => {
                    mongoConnector.should.be.ok();
                    done();
                })
                .catch(done);
        });

        it("should execute mysql queries successfully", (done) => {
            if (sqlConnector){
                let users = require(__dirname + '/../src/models/sql/users')(sqlConnector.getConnection(), data.Connector.sequelize.DataTypes);
                users.findAll({limit: 1})
                    .then((result) => {
                        result.length.should.be.equal(1);
                        done();
                    })
                    .catch(done);
            }else{
                done();
            }

        });

        it("should execute mongodb queries successfully", (done) => {
            let users = require(__dirname + '/../src/models/mongodb/users')(mongoConnector.getConnection(), data.Connector.mongoose);
            users.find().limit(1).lean().exec()
                .then((result) => {
                    result.should.be.instanceOf(Array);
                    done();
                })
                .catch(done);
        });

        it("should disconnect from mysql database successfully", () => {
            if (sqlConnector) sqlConnector.getConnection().close();
        });

        it("should disconnect from mongodb database successfully", () => {
            mongoConnector.getConnection().close();
        });

        after((done) => {
            done();
        });
    });

    describe("Bad Configuration Path", () => {
        let connectors = null,
            mongoConnector = null,
            sqlConnector = null;

        before((done) => {
            done();
        });

        it("Should throw error after null configuration", (done) => {
            try {
                connectors = new data.Connector(null);
            } catch (err) {
                err.message.should.be.equal('Connector config is undefined.');
                done();
            }
        });

        it("Should throw error after no host parameter in configuration", () => {
            try {
                let parameters = _.cloneDeep(conf.development.db);
                parameters.mongodb.host = null;
                connectors = new data.Connector(parameters);
            } catch (err) {
                err.message.should.be.equal('Can not find host parameter in database config');
            }
        });

        it("Should throw error after no port parameter in configuration", () => {
            try {
                let parameters = _.cloneDeep(conf.development.db);
                parameters.mongodb.port = null;
                connectors = new data.Connector(parameters);
            } catch (err) {
                err.message.should.be.equal('Can not find port parameter in database config');
            }
        });

        it("Should throw error after no database parameter in configuration", () => {
            try {
                let parameters = _.cloneDeep(conf.development.db);
                parameters.mongodb.database = null;
                connectors = new data.Connector(parameters);
            } catch (err) {
                err.message.should.be.equal('Can not find database parameter in database config');
            }
        });
    })

});
