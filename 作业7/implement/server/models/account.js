const UserSchema = require('../orm').User;

exports.login = params => {
    const {id, password} = params;
    return new Promise((resolve, reject) => {
        if (!id || !password) 
            return reject('No supposed field');
        UserSchema
            .findOne({
            where: {
                id: id
            }
        })
            .then(user => {
                if (!user) 
                    reject('找不到用户');
                else if (user.password != password) 
                    reject('密码错误');
                else 
                    resolve(user);
                }
            , error => {
                reject(error);
            });
    });
};

exports.register = params => {
    const {username, password, authorization} = params;
    return new Promise((resolve, reject) => {
        if (!username || !password) 
            return reject('No supposed field');
        const u = {username, password, authorization};
        UserSchema
            .create(u)
            .then(resolve, reject);
    });
};