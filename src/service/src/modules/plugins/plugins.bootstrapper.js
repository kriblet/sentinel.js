module.exports = function(service){
    return new Promise((resolve, reject)=>{
        let pluginsPromises = [];

        service.config.plugins.forEach((plugin)=>{
            try{
                let toPush = require(plugin)(service);
                pluginsPromises.push(toPush);
            }catch(err){
                service.logger.error(err);
            }
        });

        Promise.all(pluginsPromises)
            .then(()=>{
                service.logger.info("All plugins finished loading, ready to go!");
                process.nextTick(resolve);
            })
            .catch(reject);


    });
};

