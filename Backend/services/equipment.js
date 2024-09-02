const db = require('../config/databases')
module.exports = {
    // แสดงข้อมูลทั้งหมดเพื่อเอาไปทำเป็น list checkbox หน้าการจอง
    findAll(){
        return  new Promise(async (resolve,reject) => {
            await db.query('SELECT eq_id,eq_image,eq_name FROM `tb_equipments`',(err,result) => {
                if(err) return reject(err);
                resolve(result)
            })
        })
    },
    find(value){
        return new Promise(async (resolve,reject) => {

            const limitPage = 5; //กำหนดแสดงข้อมูลสูงสุดต่อหน้า
            const startPage = ((value.page || 1) - 1) * limitPage; //สูตรหาจำนวนหน้า
            const sqls = {
                count: `SELECT COUNT(*) as 'rows'  FROM tb_equipments`, //sql นับจำนวนข้อมูลทั้งหมด
                select: 'SELECT * FROM tb_equipments' //เลือกข้อมูลทั้งหมด
                
            }

            if(value.search_key && value.search_text) {
                const key  = value.search_key
                const txt = value.search_text
                const sqlSearch = ` WHERE ${db.escapeId(key)}  LIKE ${db.escape(`%${txt}%`)}`
                sqls.count += sqlSearch
                sqls.select += sqlSearch 
            }
            // console.log(sqls)
            // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY eq_id DESC'
            
            //หาจำนวนแถว
            await db.query(sqls.count,(error,result) => {
                if(error) return reject(error)
                const items = { result: [], rows: result[0].rows, limit:limitPage }; // result หาข้อมูล result.length หาแถวข้อมูล
                //แบ่งหน้า page
                sqls.select += ` LIMIT ${db.escape(startPage)},${limitPage}`;
                db.query(sqls.select, (error, result) => {
                    if (error) return reject(error);
                    items.result = result;
                    resolve(items);
                })
            })
        })
    },
    findOne(column){
        return new Promise(async(resolve,reject) => {
            await db.query('SELECT * FROM tb_equipments WHERE ?',column,(err,result) => {
                if(err) return reject(err)
                resolve(result.length > 0 ? result[0] : null)
            })
        })
    },
    onCreate(value) {
        return new Promise(async(resolve, reject) => {
          await db.query('INSERT INTO tb_equipments SET ?', value,(err,result) => {
              if(err) return reject(err);
              if(result.affectedRows == 1){
                 resolve(result)
              }
           })
        })
    },
    onUpdate(id,value) {
        return new Promise(async(resolve,reject) => {
            const $query = `
             UPDATE tb_equipments SET
               eq_name   = ?,
               eq_detail = ?,
               eq_image  = ?,
               eq_updated = NOW()
             WHERE 
                eq_id    = ?
            `
            await db.query($query,[
                value.eq_name,
                value.eq_detail,
                value.eq_image,
                id
            ],(err,result) => {
                if(err) return reject(err)
                resolve(result)
            })
        })
    },
    onDelete(id) {
        return new Promise(async(resolve,reject) => {
            await db.query('DELETE FROM tb_equipments WHERE eq_id = ?',id,(err,result) => {
                if(err) return reject(err)
                resolve(result.length > 0 ? result[0] :null)
            })
        })
    }
}