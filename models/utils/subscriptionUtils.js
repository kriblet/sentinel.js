/**
 * Created by edgardo on 1/28/17.
 */


module.exports = function (connection, mongoose, service) {
  return {
      generateCode: function (pointer) {
          return new Promise(function (resolve, reject) {
              const subsCodesModel = connection.model('subscriptionCodes');
              const crypto = require('crypto');
              pointer.code = crypto.randomBytes(10).toString("hex");
              console.log(pointer.code);
              let subsCode = new subsCodesModel(pointer);

              let attempts = 0;
              (function saveCode () {
                  if (attempts < 10) {
                      subsCode.save(function (err) {
                          if (err) {
                              console.warn(err);
                              attempts++;
                              subsCode.code = crypto.randomBytes(10).toString("hex");
                              console.log(subsCode.code);
                              saveCode();
                          } else {
                              resolve(subsCode);
                          }
                      });
                  } else {
                      reject('Can\'t generate unique code');
                  }
              })();
          });
      }
  }  
};
