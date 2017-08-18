/**
 * Created by Ben on 28/06/2017.
 */

((angular)=>{

    angular.module('data-service')
        .service('$dataService', ['$realtimeService','$rootScope',function($realtimeService, $rootScope){
            let self = this;
            self.login = function(args, callback){
                if (self.conn){
                    $realtimeService.disconnect();
                }
                self.conn = $realtimeService.connect(args);
                self.conn.on('open', ()=>{});
                self.conn.on('welcome', (data)=>{
                    $rootScope.serverStatus = 'Online';
                    callback(data);
                    self.$apply();
                });
                self.conn.on('disconnect', ()=>{
                    $rootScope.serverStatus = 'Offline';
                    self.$apply();
                });
                self.conn.on('error', (err)=>{
                    callback(err);
                });
            };

            self.emit = function(event, args){
                return new Promise((resolve, reject)=>{
                    if (!self.conn){
                        reject();
                    }else{
                        self.conn.emit(event, args, (response)=>{
                            resolve(response);
                        })
                    }
                })
            };
            self.on = function(event, callback){
                if (self.conn){
                    self.conn.on(event, callback);
                }
            };

            self.save = function(model, object){
                return new Promise((resolve, reject)=>{
                    if (!self.conn){
                        reject('No connections active');
                    }else{
                        self.conn.emit('save', {
                            model: model,
                            data: object
                        }, (response)=>{
                            resolve(response);
                        })
                    }
                })
            };


            self.find = function(args){
                return new Promise((resolve, reject)=>{
                    if (!self.conn){
                        reject('No connections active');
                    }else{
                        self.conn.emit('find', args, (response)=>{
                            resolve(response);
                        })
                    }
                })
            };

            self.findOne = function(args){
                return new Promise((resolve, reject)=>{
                    if (!self.conn){
                        reject('No connections active');
                    }else{
                        self.conn.emit('findOne', args, (response)=>{
                            resolve(response);
                        })
                    }
                })
            };

            self.findById = function(args){
                return new Promise((resolve, reject)=>{
                    if (!self.conn){
                        reject('No connections active');
                    }else{
                        self.conn.emit('findById', args, (response)=>{
                            resolve(response);
                        })
                    }
                })
            };

            self.update = function(model, newData){
                return new Promise((resolve, reject)=>{
                    if (!self.conn){
                        reject('No connections active');
                    }else{
                        self.conn.emit('findByIdAndUpdate', {model:model, new: newData}, (response)=>{
                            resolve(response);
                        })
                    }
                })
            };

            self.delete = function(model, data){
                return new Promise((resolve, reject)=>{
                    if (!self.conn){
                        reject('No connections active');
                    }else{
                        self.conn.emit('findByIdAndDelete', {model:model, data: data}, (response)=>{
                            resolve(response);
                        })
                    }
                })
            };

            self.autocomplete = function(args){
                return new Promise((resolve, reject)=>{
                    if (!self.conn){
                        reject('No connections active');
                    }else{
                        self.conn.emit('autocomplete', args, (response)=>{
                            resolve(response);
                        })
                    }
                })
            };

            self.$apply = function () {
                if($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest') {
                    $rootScope.$apply();
                }
            }

        }])


})(angular);