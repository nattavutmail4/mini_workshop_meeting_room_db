const router = require('express').Router()
const {check ,query, validationResult}  = require('express-validator')
const service = require('../services/room');

const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads'); //โฟลเดอร์ upload
const roomDir = path.join(uploadDir, 'rooms'); // ต่อ uploade/


//ดีงข้อมูลห้องประชุม
router.get('/', [
    query('page').not()
    .isEmpty()
    .isInt().toInt()
    .withMessage('กรุณาระบุ page เป็นตัวเลข')
],async (req, res) => {
    try {
        const ErrorsValidation = validationResult(req);
        if (!ErrorsValidation.isEmpty()) {
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg);
            return res.status(400).json({ msg: ErrorMsg });
        }else{
            const getEq = await service.find(req.query)
            if(!getEq){
               return res.status(404).json({msg:"ไม่พบข้อมูล"})
            }
            return res.status(200).json(getEq)
        }
    } catch (ex) {
        res.status(500).json({ msg: `${ex}` });
    }
})

// ค้นหาข้อมูลห้องประชุม
router.get('/:id',async (req,res) => {
    try {
        const rooms =  await service.findOne({r_id:req.params.id})
        if(!rooms){
            return   res.status(404).json({msg:"Not Found! "})
        }
        //แปลงรูปภาพกลับไปเป็น base64
        rooms.r_image = base64Img.base64Sync(path.join(roomDir,rooms.r_image))
        return res.status(200).json(rooms)

    } catch (ex) {
        return res.status(500).json({ msg: `${ex}` });
        
    }
})

//ลงทะเบียนห้องประชุม
router.post('/', [
    check('r_name').not().isEmpty().withMessage('กรุณาใส่ชื่อห้อง'),
    check('r_capacity').isInt().withMessage('กรุณาใส่ความจุของห้อง'),
    check('r_detail').exists(),
    check('r_image').not().isEmpty().withMessage('กรุณาใส่รูปภาพ')
],async(req, res) => {
    let rs_file ; 
    try {
        const ErrorsValidation = validationResult(req);
        if (!ErrorsValidation.isEmpty()) {
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg);
            res.status(400).json({ msg: ErrorMsg });
        } else {
            // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
            if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);
    
            // แปลงข้อมูลรูปภาพ
            const fullfilename = base64Img.imgSync(req.body.r_image, roomDir, `roomip-${Date.now()}`);
            rs_file = fullfilename || '';
            req.body.r_image = path.basename(fullfilename);
    
            if(req.body.r_detail == ''){
                req.body.r_detail = null
            }
            // เมื่อข้อมูลถูกสร้างขึ้นเรียบร้อยแล้วให้สร้างข้อมูลในฐานข้อมูล
            const result = await service.onCreate(req.body);
            res.status(201).json({ msg:'ลงข้อมูลห้องประชุมสำเร็จ' });
        }
    } catch (ex) {
        if (rs_file && fs.existsSync(rs_file)) {
            // หากมีไฟล์ที่ถูกสร้างแต่ไม่ได้ใช้งาน ให้ลบไฟล์นั้น
            fs.unlinkSync(rs_file);
        }
        res.status(500).json({ msg: `${ex}` });
    }
})

// // อัพเดทข้อมูล
router.put('/:id',[
    check('r_name').not().isEmpty().withMessage('กรุณาใส่ชื่อห้อง'),
    check('r_capacity').isInt().withMessage('กรุณาใส่ความจุของห้อง'),
    check('r_detail').exists(),
    check('r_image').not().isEmpty().withMessage('กรุณาใส่รูปภาพ')
],async(req,res) => {
    let rs_file ;
    try {
        const ErrorsValidation = validationResult(req);
        if (!ErrorsValidation.isEmpty()) {
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg);
            res.status(400).json({ msg: ErrorMsg });
        } else {
            const r_id = req.params.id
            const check = await service.findOne({r_id:r_id})
            if(!check){
                res.status(404).json({msg:"Not Found"})
            } else {
                //ตำแหน่งที่เก็บรูปเก่า
                const delImgOld  =  path.join(roomDir,check.r_image);
                // console.log(delImgOld)
                // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
                if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);

                // // แปลงข้อมูลรูปภาพ
                const fullfilename = base64Img.imgSync(req.body.r_image, roomDir, `roomip-${Date.now()}`);
                rs_file = fullfilename || '';
                req.body.r_image = path.basename(fullfilename);
                const updateItem = await service.onUpdate(r_id,req.body)

                if(updateItem.affectedRows > 0){
                    // ลบตำแหน่งรูปภาพเก่า
                    if (delImgOld && fs.existsSync(delImgOld)) {
                        // หากมีไฟล์ที่ถูกสร้างแต่ไม่ได้ใช้งาน ให้ลบไฟล์นั้น
                        fs.unlinkSync(delImgOld);
                    }
                    res.status(200).json({msg:"อัพเดทข้อมูลห้องประชุมสำเร็จ"})
                } else {
                    res.status(404).json({msg:"อัพเดทข้อมูลห้องประชุมไม่สำเร็จ"})
                }
            }
        }
    } catch (ex) {
        const rs_file = base64Img.imgSync(req.body.r_image, roomDir, `roomip-${Date.now()}`) || "";
        if (rs_file && fs.existsSync(rs_file)) {
            // หากมีไฟล์ที่ถูกสร้างแต่ไม่ได้ใช้งาน ให้ลบไฟล์นั้น
            fs.unlinkSync(rs_file);
        }
        res.status(500).json({ msg: `${ex}` });
    }
})

// // ลบข้อมูล
router.delete('/:id', async (req, res) => {
    try {
        const r_id  = req.params.id
        const check  = await service.findOne({r_id:r_id})
        if(!check){
            res.status(404).json({msg:"Not Found"})
        } else {
            const delData =  await service.onDelete(check.r_id)
            const delImg  =  path.join(roomDir,check.r_image);
            if (delImg && fs.existsSync(delImg)) {
                // หากมีไฟล์ที่ถูกสร้างแต่ไม่ได้ใช้งาน ให้ลบไฟล์นั้น
                fs.unlinkSync(delImg);
            }
            res.status(200).json({msg:"ลบข้อมูลห้องประชุมสำเร็จ"})
        }
    } catch (ex) {
        const rs_file = base64Img.imgSync(req.body.r_image, roomDir, `roomip-${Date.now()}`) || "";
        if (rs_file && fs.existsSync(rs_file)) {
            // หากมีไฟล์ที่ถูกสร้างแต่ไม่ได้ใช้งาน ให้ลบไฟล์นั้น
            fs.unlinkSync(rs_file);
        }
        res.status(500).json({ msg: `${ex}` });
    }
})

module.exports = router