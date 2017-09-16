
const fs   = require("fs");

module.exports = function(service){
    let self = service;
    self.existingRoutes = {};

    if (!self.config.directories.httpControllers){
        return;
    }
    _setHttpControllers(self, self.config.directories.httpControllers);
};

function _setHttpControllers(service, directories){
    let self = service;
    directories.forEach((apiRoute)=>{
        let apiFiles = fs.readdirSync(`${apiRoute}`);
        apiFiles.forEach((apiFile)=>{
            if (apiFile.indexOf('.js') === -1){
                return _setHttpControllers(self, [`${directories}/${apiFile}`]);
            }
            if (apiFile.indexOf('.controller') === -1){
                return;
            }

            /*requires each http api controller in directory*/
            let endpointBase = '/' + apiFile.replace('.js','');
            let httpControllersControllers = require(`${apiRoute}/${apiFile}`)(self);
            Object.keys(httpControllersControllers).forEach((key)=>{
                let endpoints = [];
                let httpControllersController = httpControllersControllers[key],
                    params = httpControllersController.params;
                if (params && params.constructor === Array && params.length > 0){
                    params.forEach(function(param){
                        if (param.constructor === Array){
                            endpoints.push(endpointBase + '/' + key + '/:' + param.join('/:'));
                        }else{
                            endpoints.push(endpointBase + '/' + key + '/:' + param);
                        }
                    })
                }else if(params && params.constructor === Array && params.length === 0){
                    endpoints.push(endpointBase + '/' + key);
                }else if(params){
                    endpoints.push(endpointBase + '/' + key + '/:' + params);
                }

                if (!self.existingRoutes[httpControllersController.type || 'get']){
                    self.existingRoutes[httpControllersController.type || 'get'] = [];
                }else{
                    let found = _.intersection(self.existingRoutes[httpControllersController.type || 'get'], endpoints);
                    if (found){
                        throw new Error(`Routes already defined ${found.join(" | ")}` );
                    }
                }
                self.existingRoutes[httpControllersController.type || 'get'] = self.existingRoutes[httpControllersController.type || 'get'].concat(endpoints);
                self.app[httpControllersController.type || 'get'](endpoints, httpControllersController.middleware || null, httpControllersController.worker);
            });
        });
    });
}