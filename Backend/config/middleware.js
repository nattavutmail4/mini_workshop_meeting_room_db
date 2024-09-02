const { validationResult } = require('express-validator');

exports.validationData = (req,res,next) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        const ErrorMsg = error.array().map((err) => err.msg)
        res.status(400).json({message:ErrorMsg})
    } else {
        return ;
    }
}

// exports.ShowError = (req,res,next) => {
//     console.log(req)
// }
// module.exports = (req, res, next) => {

//     validationData = () => {
//         const error = validationResult(req)
//         if(!error.isEmpty()){
//             const ErrorMsg = error.array().map((err) => err.msg)
//             res.status(400).json({message:ErrorMsg})
//         }
//         return;
//     },
//     // แสดงค่า Error ออกไป
//     ShowError = function (ex, status = 400) {
//         console.log(ex)
//         // res.status(status).json({ message: ex.message });
//     },
//     next();
// }






















 // const errors = validationResult(req).array();
// if (errors.length == 0) return;
// const Errormsg = errors.map(err => err.msg)
// const neWerror = Errormsg.join(',')
// // throw new Error(`${neWerror} `);
// res.status(400).json(neWerror)