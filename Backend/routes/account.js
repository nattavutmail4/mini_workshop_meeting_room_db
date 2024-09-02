const router = require('express').Router()
const {check , validationResult}  = require('express-validator')
const {onRegister, onLogin} = require('../services/account')
const {authenticator} =require('../config/security')

// ลงทะเบียน
router.post('/register',[
   check('u_username')
    .not()
    .isEmpty()
    .withMessage('กรุณาระบุข้อมูล u_username'),

    check('u_password')
    .not()
    .isEmpty()
    .withMessage('กรุณาระบุข้อมูล u_password'),

    check('u_firstname')
    .not()
    .isEmpty()
    .withMessage('กรุณาระบุข้อมูล u_firstname'),
 
    check('u_lastname')
    .not()
    .isEmpty()
    .withMessage('กรุณาระบุข้อมูล u_lastname')
], async(req, res) => {
    try {
        const ErrorsValidation = validationResult(req)
        if(!ErrorsValidation.isEmpty()) {
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg)
            return res.status(404).json({msg:ErrorMsg})
        }
        const create = await onRegister(req.body)
        if(create.affectedRows == 1) {
          return res.status(201).json({statusCode:201,body:req.body})
        }else{
          return  res.status(400).json({statusCode:400,msg:"ไม่สามารถลงทะเบียนได้ ข้อมูลนี้อาจจะมีอยู่ในระบบแล้ว"})
        }
    } catch (ex) {
      return res.status(500).json({msg:`${ex}`})
        
    }
})

// เข้าสู่ระบบ
router.post('/login',[
    check('u_username')
    .not()
    .isEmpty()
    .withMessage('กรุณาระบุ u_username'),

    check('u_password')
    .not()
    .isEmpty()
    .withMessage('กรุณาระบุ u_password')
],async(req,res) => {
    try {
        const ErrorsValidation = validationResult(req)
        if(!ErrorsValidation.isEmpty()) {
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg)
            return  res.status(404).json({msg:ErrorMsg})
        }
        const userLogin = await onLogin(req.body)
        req.session.userLogin = userLogin
        return res.status(200).json({statusCode:200,msg:userLogin})
    } catch (ex) {
      return  res.status(500).json({msg:`${ex}`})
    }
})


//ตรวจสอบ user login หรือไม่
router.get('/userLogin',authenticator,(req,res) => {
  try {
    if(req.session.userLogin){
        return res.status(200).json(req.session.userLogin)
    }
    return res.status(401).json({msg:"Unauthorize."})
  } catch (ex) {
    return res.status(401).json({msg:`${ex}`}) 
  }
})

// logout ออกจากระบบ
router.post('/logout',(req, res) => {
  try {
    // ลบข้อมูล session logout
    delete req.session.userLogin 
    return res.status(200).json({statusCode:200,msg:"Logout"})
  } catch (ex) {
    return res.status(401).json({msg:`${ex}`}) 
  }
})
module.exports = router