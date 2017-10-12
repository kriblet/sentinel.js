
const io = require("socket.io"),
    fs   = require("fs"),
    mongoose =  require("mongoose");

module.exports = function(service){
    let self = service;

    self.io = io.listen(self.server);

    // attach events from api to io clients
    let apiFiles = fs.readdirSync(`${__dirname}/../common`),
        apiControllers = [];


    apiFiles.forEach((apiFile)=>{
        if (!apiFile.indexOf('.js') === -1){
            return;
        }
        /*requires each api controller in directory*/
        apiControllers.push(require(`${__dirname}/../common/${apiFile}`)(self, mongoose));
    });

    if (self.config.usersEngine){

        let usersApiFiles = fs.readdirSync(`${__dirname}/../users`);
        usersApiFiles.forEach((apiFile)=>{
            if (apiFile.indexOf('.js') === -1){
                return;
            }
            /*requires each api controller in directory*/
            apiControllers.push(require(`${__dirname}/../users/${apiFile}`)(self));
        });
    }


    if (self.config.directories.controllers){
        let customApiFiles = [];
        if (self.config.directories.controllers.constructor === Array){
            self.config.directories.controllers.forEach((customApiRoute)=>{
                customApiFiles.push({route: customApiRoute, files: fs.readdirSync(customApiRoute)});
            })
        }else{
            customApiFiles.push({route: self.config.directories.controllers, files: fs.readdirSync(self.config.directories.controllers)});
        }
        customApiFiles.forEach((customController)=>{
            customController.files.forEach((customControllerFile)=>{
                apiControllers.push(require(`${customController.route}/${customControllerFile}`)(self));
            })
        });
    }

    console.log(apiControllers);

    // security middleware
    if (self.config.usersEngine) {
        self.io.use(self.security.middleware);
    }
    self.connections = {};
    /* What to do if some user is connected? */
    self.io.sockets.on('connection', function (client) {
        if (self.config.usersEngine) {
            if (client.user && client.user.me) {
                if (!self.connections[client.user.me._id]) {
                    self.connections[client.user.me._id] = [];
                }
                self.connections[client.user.me._id].push(client);
            }
        }
        /*for each controller registered in api, attach the event and worker*/
        apiControllers.forEach((apiController)=>{
            if (apiController.constructor === Array){
                apiController.forEach((apiConrollerMember)=>{
                    if (self.config.usersEngine) {
                        if (!client.user && !client.user.me && !apiConrollerMember.public) {
                            return;
                        }
                    }
                    client.on(apiConrollerMember.event, (args, ack)=> {
                        if (self.config.usersEngine) {
                            if (client.user && client.user.me) {
                                console.log("User authenticated");
                                client.user.session.validAt = new Date();
                                client.user.session.save((err) => {
                                    console.log("update session", err)
                                });
                            }
                        }
                        apiConrollerMember.worker(client, args, ack);
                    });
                })
            }else {
                if (self.config.usersEngine) {
                    if (!client.user && !client.user.me && !apiController.public) {
                        return;
                    }
                }
                client.on(apiController.event, (args, ack)=> {
                    if (self.config.usersEngine) {
                        if (client.user && client.user.me) {
                            console.log("User authenticated");
                            client.user.session.validAt = new Date();
                            client.user.session.save((err) => {
                                console.log("update session", err)
                            });
                        }
                    }
                    apiController.worker(client, args, ack);
                });
            }
        });
        if (self.config.usersEngine) {
            if (client.user && client.user.me) {
                let _me = client.user.me.toObject();
                _me.password = '****';

                client.emit('welcome', {isValid: true, user: _me, session: client.user.session.toObject()});
            }
        }

        client.on('disconnect', () => {
            if (self.config.usersEngine) {
                if (client.user && client.user.me) {
                    _.remove(self.connections[client.user.me._id], function (currConnection) {
                        return currConnection.id === client.id;
                    });
                }
            }
            client.disconnect();
        });
    });
}