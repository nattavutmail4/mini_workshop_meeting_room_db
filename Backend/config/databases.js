
const mysql = require('mysql')
const {
    DB_HOST ,
    DB_USER ,
    DB_PASS , 
    DB_NAME 
 } = require('./configs')

const db = mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASS,
    database:DB_NAME,
    charset:"utf8"
});
module.exports = db
