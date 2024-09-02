const db = require('../config/databases')
const { password_hash, password_verify } = require('../config/security')
const table = 'tb_users';
module.exports = {
    onRegister(value){
        // resolove  == success reject =false
        return new Promise(async(resolve, reject) => {
            value.u_password = await password_hash(value.u_password)
            db.query('INSERT INTO tb_users SET ?', value,(error,result) => {
                if(error) return reject(error);
                if(result.affectedRows == 1){
                    resolve(result)
                }
            }); 
        });
    },

    onLogin(value) {
        return new Promise(async (resolve, reject) => {
            db.query('SELECT * FROM tb_users WHERE u_username=?', [value.u_username], (error, result) => {
                if (error) return reject(error);
                if (result.length > 0) {
                    const userLogin = result[0];
                    password_verify(value.u_password, userLogin.u_password)
                        .then(res => {
                            if (res === true) {
                                delete userLogin.u_password;
                                delete userLogin.u_created;
                                delete userLogin.u_updated;
                                resolve(userLogin);
                            } else {
                                reject(new Error('Invalid username or password'));
                            }
                        })
                        .catch(err => {
                            reject(new Error('Invalid username or password'));
                        });
                } else {
                    reject(new Error('Invalid username or password'));
                }
            });
        });
    }
};

// Auto generate admin when user exists
 db.query(`SELECT * FROM ${table} WHERE u_username = 'admin'`, async(error, result) => {
    if (error) return;
    if (result.length > 0) return;
    const generateAdmin = {
        u_username: 'admin',
        u_password: await password_hash('admin'),
        u_firstname: 'Administrator',
        u_lastname: 'Administrator',
        u_role: 'admin'
    };
    db.query(`INSERT INTO ${table} SET ?`, generateAdmin, (error, result) => {
        if (error) return;
        console.log(result);
    });
});