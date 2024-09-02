const dotenv = require('dotenv').config()
// const crypto = require('crypto');

// สร้างคีย์ลับอัตโนมัติด้วยความสุ่ม
// const generateRandomSecret = () => {
//   return crypto.randomBytes(32).toString('hex');
// }

// const secretKey = generateRandomSecret();

// console.log('Auto-generated SECRET key:', secretKey);

exports.PORT = process.env.PORT || 5000
exports.SECRET = process.env.SECRET || 'i love cat'

exports.DB_HOST = process.env.DB_HOST,
exports.DB_USER = process.env.DB_USER,
exports.DB_PASS = process.env.DB_PASS, 
exports.DB_NAME = process.env.DB_NAME