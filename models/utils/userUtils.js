/**
 * Created by edgardo on 12/7/16.
 */

const userTypes = require('./userType');
const mongoose = require('mongoose');
const userUtils = {
    elevate: elevate,
    userAccessVerify: userAccessVerify,
    getMyUsers: getMyUsers
};

/////////////////////////////////
function elevate(loggedUser, query) {
    if (loggedUser.userId.userType !== userTypes.admin) {
        return { $and: [ query,
            { $or: [
                { visibility : {$eq: 4} },
                { _id : mongoose.Types.ObjectId(loggedUser.userId._id) },
                { $and: [
                    { visibility : {$gte: 1, $lte: 3} },
                    { userId : mongoose.Types.ObjectId(loggedUser.userId._id) }
                ]},
                { $and: [
                    { visibility : {$gte: 1, $lte: 3} },
                    { userId : { $in: loggedUser.userId.subUsers.map(function (subUserId) {
                        return mongoose.Types.ObjectId(subUserId);
                    })} }
                ]},
                { $and: [
                    { visibility : {$gte: 1, $lte: 3} },
                    { userAccess : { $in: [mongoose.Types.ObjectId(loggedUser.userId._id)]} }
                ]}
            ]}
        ]};
    }
    return query;
}

function getMyUsers (userId, usersModel, select) {
    return new Promise(function (resolve, reject) {
        usersModel.findOne({_id: userId}, function (error, user) {
            if (error) {
                reject(error);
            } else {
                if (!user) {
                    reject('User not found: ', userId);
                } else {
                    let query = userUtils.elevate({userId: user}, {});
                    usersModel.find(query).lean().select(select).exec(function (err, users) {
                        if (err) {
                            reject(error);
                        } else {
                            resolve(users);
                        }
                    });
                }
            }
        });
    });
}

function userAccessVerify(model, usersModel, newData, userId) {
    return new Promise(function (resolve, reject) {
        userUtils.getMyUsers(userId, usersModel, '_id')
            .then(function (users) {
                let myUserAccess = users.map(user => user._id.toString());
                model.findOne({_id: newData._id}, function (err, oldData) {
                    if (err) {
                        reject(err);
                    } else {
                        let userNoAccess = oldData.userAccess.map(id => id.toString())
                            .filter(id => myUserAccess.indexOf(id) === -1);
                        let newUserAccess = newData.userAccess.map(id => id.toString())
                            .concat(userNoAccess)
                            .filter((id, idx, arr) => arr.indexOf(id) === idx)
                            .map(id => mongoose.Types.ObjectId(id));
                        resolve(newUserAccess);
                    }

                });
            })
            .catch(function (err) {
                reject(err);
            });

    });
}

module.exports = userUtils;
