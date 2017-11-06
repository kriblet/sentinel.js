module.exports = function(service){
    service.logger.info("plugin 1");

    return new Promise((resolve, reject)=>{
        setTimeout(function(){
            service.logger.info("firing plugin 1");
            resolve();
        }, 1000);
    });
};