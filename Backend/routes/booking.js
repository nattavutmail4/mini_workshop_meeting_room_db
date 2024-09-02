const router = require('express').Router()
const {check ,query, param, validationResult}  = require('express-validator')
const { isInRoles} = require('../config/security')

const roomService = require('../services/room')
const bookingService = require('../services/booking')
const equipmentsService = require('../services/equipment')

//แสดงรายการห้องประชุมที่จะทำการจอง
router.get('/',[
    query('page').isInt().withMessage('กรุณาระบุ page เป็นตัวเลข')
] , async(req,res) => {
    try {
        const ErrorsValidation = validationResult(req);
        if (!ErrorsValidation.isEmpty()) {
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg);
            return res.status(400).json({ message: ErrorMsg });
        }
        return res.json(await roomService.find(req.query))
    } catch (error) {
        return res.status(404).json({error})
    }
})

// แสดงอุปกรณ์ห้องประชุมเพื่อเอาไปทำ list checkbox
router.get('/equipments', async (req,res) => {
    try {
        const equipments = await equipmentsService.findAll()
        if(!equipments){
            return  res.status(404).json({message:"ไม่พบข้อมูลอุปกร์"})
        }
        return res.status(200).json(equipments)
    } catch (error) {
        return res.status(409).json({error})
    }
})

//แสดงประวัติการจองห้องประชุม
router.get('/history',[
    check('page').isInt().withMessage('กรุณาระบุ page ที่จะดู')
],async(req,res) => {
    try {
        const ErrorsValidation = validationResult(req)
        if(!ErrorsValidation.isEmpty()){
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg) 
            return  res.status(400).json(ErrorMsg)
        } else {
            const Bookings = await bookingService.findHistory(req.query,req.session.userLogin.u_id,req.session.userLogin.u_role)
            console.log(Bookings)
            return res.status(200).json(Bookings)
        }
    } catch (error) {
        return  res.status(400).json({error})
    }
})

// แสดงรายละเอียดของห้อง
router.get('/room/:id', async(req,res) => {
    try {
        const model = await roomService.findDetailForBooking(req.params.id);
        if (!model) {
            return res.status(400).json({
                message:"Not Found item."
            })
        }
        return res.json(model);
    } catch (ex) {
        return res.status(500).json({ error: ex });

    }
})

// เพิ่มการจองห้องประชุม
router.post('/',[
    check('tb_rooms_r_id').isInt().withMessage('ไม่พบหมายเลขห้องที่ต้องการจอง'),
    check('bk_title').not().isEmpty().withMessage('กรุณาระบุข้อมูล bk_title '),
    check('bk_detail').exists(),
    check('bk_time_start').custom(value => !isNaN( Date.parse(value) )).withMessage('กรุณาใส่ข้อมูลวันที่'),
    check('bk_time_end').custom(value   => !isNaN( Date.parse(value) )).withMessage('กรุณาใส่ข้อมูลวันที่วันที่สินสุด'),
    check('equipments').custom(values => { 
        const isArray = Array.isArray(values) //ตรวจสอบ value ว่ารับค่ามาเป็น array ไหม
        if(isArray &&  values.length > 0){
            return values.filter(item => isNaN(item)).length  == 0 //filter ตรวจสอบข้อมูลข้างใน
        }
        return isArray
    }).withMessage('รับข้อมูลเป็นตัวเลขเท่านั้นในรูปแบบ array')
],async(req,res) => {
    try {
        const ErrorsValidation = validationResult(req)
        if(!ErrorsValidation.isEmpty()){
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg) 
            return  res.status(400).json(ErrorMsg)
        } else {
            req.body.tb_users_u_id = req.session.userLogin.u_id
            const booking = await bookingService.onCreate(req.body)
            if(!booking){
                return res.status(400).json({ message: 'ไม่สามารถสร้างการจองได้'});
            }
            return  res.status(200).json(booking)
        }

    } catch (error) {
        if (error.code === 400) {
           return res.status(400).json({ message: error.message});
        } else {
           return res.status(500).json({ message: 'มีข้อผิดพลาดในการประมวลผลการจอง', error: error.message });
        }
    }
})

// region สำหรับผู้ดูแลระบบ

// ดึงข้อมูลห้องประชุมมา Select
router.get('/rooms/select' , async(req,res) => {
    try {
        const findSelect = await roomService.findSelect()
        if(!findSelect){
            return res.status(400).json({message:"Not Found item!.."})
        }
        res.json(findSelect);
    } catch (er) {
        return res.status(500).json({message:er})
    }
})

// ดึงข้อมูลการจองห้องประชุมจาก rooms มาแสดง
router.get('/calendar/room/:id', isInRoles(['admin']) , [param('id').isInt().withMessage('กรุณาระบุ param id ')],async(req, res) => {
    try {
        const ErrorsValidation = validationResult(req)
        if(!ErrorsValidation.isEmpty()){
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg) 
            return  res.status(400).json(ErrorMsg)
        } 
        const findByRoomId = await bookingService.findByRoomId(req.params.id)
        if(!findByRoomId){
            return res.status(400).json({message:'Not Found item..'})
        }
        return res.status(200).json(findByRoomId)
    } catch (error) {
        if (error.code === 400) {
            return res.status(400).json({ message: error.message});
         } else {
            return res.status(500).json({ message: 'มีข้อผิดพลาดในการประมวลผลการจอง', error: error.message });
         }
    }
})

// แสดงรายการจองห้องประชุมของสมาชิก
router.get('/manage',isInRoles(['admin']), [ check('page').isInt().withMessage('กรุณาระบุ page ที่จะดู') ], async(req,res) => {
    try {
        const ErrorsValidation = validationResult(req)
        if(!ErrorsValidation.isEmpty()){
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg) 
            return  res.status(400).json(ErrorMsg)
        }
        // 
        const FindAll = await bookingService.find()
        if(FindAll){
            return res.status(400).json({message:'Not Found item...'})
        }
        
        return res.status(200).json(FindAll)
    } catch (error) {
        if (error.code === 400) {
            return res.status(400).json({ message: error.message});
         } else {
            return res.status(500).json({ message: 'มีข้อผิดพลาดในการประมวลผลการจอง', error: error.message });
         }
    }
})

// แก้ไขสถานะการจองเป็น อนุมัติ กับ ไม่ อนุมัติ
router.put('/manage/:id' ,isInRoles(['admin']), [
    param('id').isInt().withMessage('ระบุ ID'),
    check('bk_status').isIn(['allowed','not allowed']).withMessage('กรุณาระบุ bk_status เพื่อปรับสถานะการจอง เช่น allowed หรือ not allowed')
], async(req, res) => {
    try {
        const ErrorsValidation = validationResult(req)
        if(!ErrorsValidation.isEmpty()){
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg) 
            return  res.status(400).json(ErrorMsg)
        }
        const findById = await bookingService.findById(req.params.id)
        if(!findById) {
            return res.status(400).json({message:"Not Found item! "})
        }
        const update   = await bookingService.onUpdate(req.body,req.params.id)
        if(update.affectedRows > 0){
           return res.status(200).json({message:"Update success", response:update})
        }else {
            return res.status(400).json({message:"Update False"})
        }
    } catch (error) {
        if (error.code === 400) {
          return res.status(400).json({ message: error.message});
        } else {
          return res.status(500).json({ message: 'มีข้อผิดพลาดในการประมวลผลการอนุมัติ', error: error.message });
        }
    }
})

// ลบข้อมูลห้องประชุม
router.delete('/manage/:id', isInRoles(['admin']), [
    param('id').isInt().withMessage('กรุณาระบุ ID')
], async(req,res) => {
    try {
        const ErrorsValidation = validationResult(req)
        if(!ErrorsValidation.isEmpty()){
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg) 
            return  res.status(400).json(ErrorMsg)
        }
        const findById  = await bookingService.findById(req.params.id)
        if(!findById) {
            return res.status(400).json({message:"Not Found item! "})
        }
        const deleteItem = await bookingService.onDelete(req.params.id)
        if(deleteItem){
            return res.status(200).json({message:"delete success"}) 
        }else {
            return res.status(400).json({message:'delete false'})
        }
    } catch (error) {
        if (error.code === 400) {
            return res.status(400).json({ message: error.message});
          } else {
            return res.status(500).json({ message: 'มีข้อผิดพลาดในการประมวลผลการลบ', error: error.message });
          }
    }
})
module.exports = router