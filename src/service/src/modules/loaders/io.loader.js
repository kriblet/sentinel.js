
const io = require("socket.io"),
    fs   = require("fs"),
    mongoose =  require("mongoose");

module.exports = function(service){
    var self = service;

    self.io = io.listen(self.server);

    // attach events from api to io clients
    var apiFiles = fs.readdirSync(`${__dirname}/../common`),
        apiControllers = [];


    apiFiles.forEach((apiFile)=>{
        if (!apiFile.indexOf('.js') === -1){
            return;
        }
        /*requires each api controller in directory*/
        apiControllers.push(require(`${__dirname}/../common/${apiFile}`)(self, mongoose));
    });

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
                if (customControllerFile.indexOf('.realtime') === -1){
                    return;
                }
                apiControllers.push(require(`${customController.route}/${customControllerFile}`)(self));
            })
        });
    }

    if (apiControllers.length > 0){
        self.logger.debug('Realtime controllers ready');
        self.logger.debug('-- realtime');
        apiControllers.forEach((c)=>{
            if (c.constructor === Array){
                c.forEach((ac)=>{
                    self.logger.debug(`-- -- ${ac.event}`);
                })
            }else {
                self.logger.debug(`-- -- ${c.event}`);
            }
        })
    }

    self.connections = {};

    /* What to do if some user is connected? */
    self.io.sockets.on('connection', function (client) {
        /*for each controller registered in api, attach the event and worker*/
        apiControllers.forEach((apiController)=>{
            if (apiController.constructor === Array){
                apiController.forEach((apiConrollerMember)=>{
                    self.logger.debug(`event[${apiConrollerMember.event}] attached to socket[${client.id}]`);
                    client.on(apiConrollerMember.event, (args, ack)=> {
                        self.logger.debug(`event[${apiConrollerMember.event}] fired on socket[${client.id}]`);
                        apiConrollerMember.worker(client, args, ack);
                    });
                })
            }else {
                self.logger.debug(`event[${apiController.event}] attached to socket[${client.id}]`);
                client.on(apiController.event, (args, ack)=> {
                    self.logger.debug(`event[${apiController.event}] fired on socket[${client.id}]`);
                    apiController.worker(client, args, ack);
                });
            }
        });
        client.on('disconnect', () => {
            client.disconnect();
        });
    });
}