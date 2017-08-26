/**
 * Created by Ben on 03/06/2017.
 */

const bcrypt = require("bcrypt");

class Security{
    constructor(service){
        this.service = service;
    }
    get middleware(){
        let self = this;
        return (socket, next) => {
            if (!socket.user) {
                socket.user = {
                    token: socket.handshake.headers['x-session-id'] || null,
                    app: socket.handshake.headers['x-app-id']|| null,
                    username: socket.handshake.headers['x-username']|| null,
                    password: socket.handshake.headers['x-password']|| null
                };
                if (socket.user.app) {
                    self.models.mongodb.apps.findById(socket.user.app, (err, app)=>{
                        if (app){
                            socket.user.app = app;
                            if (socket.user.token) /* user already has a session token */ {
                                /**
                                 * Session section
                                 * find latest session to connect.
                                 */
                                self.models.mongodb.sessions.findOne({ token:socket.user.token, validAt: { $gte: new Date() }})
                                    .populate('user').then((session) => {
                                    if (!session) {
                                        return next({
                                            message: {isValid: false, error: 'Sesión expirada o inválida'}
                                        });
                                    } else {
                                        session.validAt = new Date();
                                        session.save();
                                        socket.user.session = session;
                                        self.models.mongodb.users.populate(session, [{
                                            path: 'user.information.country',
                                            select: 'name',
                                            model: self.models.mongodb.countries
                                        },{
                                            path: 'user.information.state',
                                            select: 'name',
                                            model: self.models.mongodb.states
                                        },{
                                            path: 'user.information.city',
                                            select: 'name',
                                            model: self.models.mongodb.cities
                                        }], (err)=>{
                                            if (err){
                                                return next(err);
                                            }else{
                                                socket.user.me = session.user;
                                                console.log(`${socket.user.me.email} connected from ${socket.user.app.name} with existent session`);
                                                return next();
                                            }

                                        });


                                    }
                                }).catch((err) => {
                                   return next({
                                       message: {isValid: false, error: err.message}
                                    });
                                });
                            }else if(socket.user.username)/* login */ {
                                /**
                                 * Login section
                                 * find the user with email, then verify the password
                                 */
                                self.models.mongodb.users.findOne({$or:[{email:socket.user.username},{username: socket.user.username}]}).then((user) => {
                                    if (!user) {
                                        return next({
                                            message: {isValid: false, error: 'Usuario no encontrado'}
                                        });
                                    } else {
                                        let loginResult = bcrypt.compareSync(socket.user.password, user.password);
                                        if (loginResult) {
                                            self.models.mongodb.users.populate(user, [{
                                                path: 'information.country',
                                                select: 'name',
                                                model: self.models.mongodb.countries
                                            },{
                                                path: 'information.state',
                                                select: 'name',
                                                model: self.models.mongodb.states
                                            },{
                                                path: 'information.city',
                                                select: 'name',
                                                model: self.models.mongodb.cities
                                            }], (err)=>{
                                                if (err){
                                                    return next(err);
                                                }else{
                                                    socket.user.me = user;
                                                    let newSession = new self.models.mongodb.sessions({
                                                        user: user._id,
                                                        validAt: new Date()
                                                    });
                                                    newSession.save((err)=>{
                                                        if (err){
                                                            return next({
                                                                message: {isValid: false, error: err.message}
                                                            });
                                                        }else {
                                                            socket.user.session = newSession;
                                                            console.log(`${socket.user.me.email} connected from ${socket.user.app.name} with login`);
                                                            return next();
                                                        }
                                                    })
                                                }

                                            });


                                        }else{
                                            return next({
                                                message: {isValid: false, error: 'La contraseña no es correcta'}
                                            });
                                        }
                                    }
                                }).catch((err) => {
                                    return next({
                                        message: {isValid: false, error: err.message}
                                    });
                                });

                            }else{
                                let action = socket.handshake.headers['x-action'].toLowerCase();
                                if (this.service.config.actions.indexOf(action) > -1){
                                    socket.user = null;
                                    socket.action = action;
                                    return next();
                                }
                                return next({
                                    message: {isValid: false, error: 'Acción no valida'}
                                });
                            }
                        }else{
                            return next({
                                message: {isValid: false, error: 'Id de aplicación no valido'}
                            });
                        }

                    });
                }else {
                    return next({
                        message: {isValid: false, error: 'Missing header [x-app-id]'}
                    });
                }
            }else{
                console.log("User authenticated");
                socket.user.session.validAt = new Date();
                socket.user.session.save();
                next();
            }


        };
    }
    get httpMiddleware(){
        let self = this;
        return (req,res,next)=>{
            let appId = req.headers['x-app-id'];
            console.log(appId);
            if (appId){
                self.models.mongodb.apps.findById(appId, (err, app)=>{
                    if (app){
                        req.app = app;
                        next();
                    }else{
                        res.json({
                            isValid:false,
                            error: 'appId invalid'
                        })
                    }
                });
            }else{
                res.json({
                    isValid:false,
                    error: 'appId invalid'
                })
            }

        }
    }
    use(models){
        this.models = models;
    }
}

module.exports = Security;