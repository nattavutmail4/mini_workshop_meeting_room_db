const router = require('express').Router()
const {check ,query, validationResult}  = require('express-validator')
const service = require('../services/equipment');


const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads'); //โฟลเดอร์ upload
const equipDir = path.join(uploadDir, 'equipments'); // ต่อ uploade/



//ดึงข้อมูล
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
                res.status(400).json({msg:"Not Found"})
            }
            return  res.status(200).json(getEq)
        }
    } catch (ex) {
        return res.status(500).json({ msg: `${ex}` });
    }
})
// แสดงข้อมูล
router.get('/:id',async (req,res) => {
    try {
        const equipment =  await service.findOne({eq_id:req.params.id})
        if(!equipment){
            res.status(404).json({msg:"Not Found! "})
        }
        //แปลงรูปภาพกลับไปเป็น base64
        equipment.eq_image = base64Img.base64Sync(path.join(equipDir,equipment.eq_image))
        return res.status(200).json(equipment)

    } catch (ex) {
        return res.status(500).json({ msg: `${ex}` });
        
    }
})
//เพิ่มข้อมูลอุปกรณ์
router.post('/', [
    check('eq_name').not().isEmpty().withMessage('กรุณาใส่ eq_name'),
    check('eq_image').not().isEmpty().withMessage('กรุณาใส่รูปภาพ')
],async(req, res) => {
    let rs_file; 
    try {
        const ErrorsValidation = validationResult(req);
        if (!ErrorsValidation.isEmpty()) {
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg);
            return res.status(400).json({ msg: ErrorMsg });
        } else {
            // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
            if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir);
    
            // แปลงข้อมูลรูปภาพ
            const fullfilename = base64Img.imgSync(req.body.eq_image, equipDir, `equip-${Date.now()}`);
            rs_file = fullfilename;
            req.body.eq_image = path.basename(fullfilename);
    
            // เมื่อข้อมูลถูกสร้างขึ้นเรียบร้อยแล้วให้สร้างข้อมูลในฐานข้อมูล
            const result = await service.onCreate(req.body);
            return res.status(201).json({ message: "success" });
        }
    } catch (ex) {
        if (rs_file && fs.existsSync(rs_file)) {
            // หากมีไฟล์ที่ถูกสร้างแต่ไม่ได้ใช้งาน ให้ลบไฟล์นั้น
            fs.unlinkSync(rs_file);
        }
        return res.status(500).json({ msg: `${ex}` });
    }
})

// อัพเดทข้อมูล
router.put('/:id',[
    check('eq_name')
    .not()
    .isEmpty()
    .withMessage('กรุณาระบุข้อมูล ชื่ออุปกรณ์ ที่จะอัพเดท'),

    check('eq_image')
    .not()
    .isEmpty()
    .withMessage('กรุณาระบุ รูปภาพที่ต้องการอัพเดท')
],async(req,res) => {
    let rs_file;
    try {
        const ErrorsValidation = validationResult(req);
        if (!ErrorsValidation.isEmpty()) {
            const ErrorMsg = ErrorsValidation.array().map((err) => err.msg);
            return  res.status(400).json({ msg: ErrorMsg });
        } else {
            const eq_id = req.params.id
            const check = await service.findOne({eq_id:eq_id})
            if(!check){
                return res.status(404).json({msg:"Not Found"})
            } else {
                //ตำแหน่งที่เก็บรูปเก่า
                const delImgOld  =  path.join(equipDir,check.eq_image);
                // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
                if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir);

                // // แปลงข้อมูลรูปภาพ
                const fullfilename = base64Img.imgSync(req.body.eq_image, equipDir, `equip-${Date.now()}`);
                rs_file = fullfilename;
                req.body.eq_image = path.basename(fullfilename);
                const updateItem = await service.onUpdate(eq_id,req.body)
                if(updateItem.affectedRows > 0){
                    // ลบตำแหน่งรูปภาพเก่า
                    if (delImgOld && fs.existsSync(delImgOld)) {
                        // หากมีไฟล์ที่ถูกสร้างแต่ไม่ได้ใช้งาน ให้ลบไฟล์นั้น
                        fs.unlinkSync(delImgOld);
                    }
                    return   res.status(200).json({msg:"succes"})
                } else {
                    return  res.status(404).json({msg:"false"})
                }
            }
        }
    } catch (ex) {
        if (rs_file && fs.existsSync(rs_file)) {
            // หากมีไฟล์ที่ถูกสร้างแต่ไม่ได้ใช้งาน ให้ลบไฟล์นั้น
            fs.unlinkSync(rs_file);
        }
        return res.status(500).json({ msg: `${ex}` });
    }
})

// ลบข้อมูล
router.delete('/:id', async (req, res) => {
    try {
        const eq_id  = req.params.id
        const check  = await service.findOne({eq_id:eq_id})
        if(!check){
            return  res.status(404).json({msg:"Not Found"})
        } else {
            const delData =  await service.onDelete(check.eq_id)
            const delImg  =  path.join(equipDir,check.eq_image);
            if (delImg && fs.existsSync(delImg)) {
                // หากมีไฟล์ที่ถูกสร้างแต่ไม่ได้ใช้งาน ให้ลบไฟล์นั้น
                fs.unlinkSync(delImg);
            }
            return  res.status(200).json({msg:"Delete success"})
        }
    } catch (ex) {
        return res.status(500).json({ msg: `${ex}` });
    }
})

module.exports = router