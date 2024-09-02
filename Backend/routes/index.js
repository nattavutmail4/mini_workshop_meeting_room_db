const router = require('express').Router()
const { authenticator , isInRoles} = require('../config/security')

//router สำหรับจัดการข้อมูล account
router.use('/account',require('./account'))

//router สำหรับจัดการข้อมูล อุปกรณ์ห้องประชุม
router.use('/equipment',authenticator,isInRoles(['admin']),require('./equipment'))

//router สำหรับจัดการห้องประชุม
router.use('/rooms',authenticator,isInRoles(['admin']),require('./room'))

//router สำหรับการจอง
router.use('/booking',authenticator ,require('./booking'))

module.exports = router