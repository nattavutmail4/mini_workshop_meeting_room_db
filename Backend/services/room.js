const db = require('../config/databases')
const table = 'tb_rooms'
module.exports = {
    findDetailForBooking(id){
        return new Promise(async (resolve,reject) => {
            db.query(`
            SELECT 
                r_id,
                r_image,
                r_name,
                r_capacity,
                (SELECT COUNT(*) FROM tb_bookings WHERE tb_rooms_r_id = r_id AND bk_status = 'pending') AS r_booking,
                r_detail
              FROM ${table}
              WHERE r_id = ?`, [id],(err,result) => {
                if(err) return reject(err)
                resolve(result.length === 0 ?  null : result[0])
            })
        })
    },
    findSelect(){
        return new Promise(async (resolve, reject) => {
          await db.query(`SELECT r_id, r_name FROM ${table}`,(err,result) => {
                if(err) return reject(err)
                resolve(result)
            });
        });
    },
    find(value){
        return new Promise(async (resolve,reject) => {

            const limitPage = 3; //กำหนดแสดงข้อมูลสูงสุดต่อหน้า
            const startPage = ((value.page || 1) - 1) * limitPage; //สูตรหาจำนวนหน้า
            const sqls = {
                count: `SELECT COUNT(*) as 'rows'  FROM ${table}`, //sql นับจำนวนข้อมูลทั้งหมด
                select: `SELECT * FROM ${table} ` //เลือกข้อมูลทั้งหมด
                
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
            sqls.select += ' ORDER BY r_updated DESC'
            
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
            await db.query(`SELECT * FROM ${table} WHERE ?`,column,(err,result) => {
                if(err) return reject(err)
                resolve(result.length > 0 ? result[0] :null)
            })
        })
    },
    
    onCreate(value){
        return new Promise(async (resolve,reject) => {
            await db.query(`INSERT INTO ${table} SET ?`, value,(err,result) => {
                if(err) return reject(err);
                if(result.affectedRows == 1){
                   resolve(result)
                }
            })
        })
    },
    onUpdate(id,value){
        return new Promise(async (resolve,reject) => {
            // resolve(value)
            console.log(value)
            console.log(id)
            const $query = `
              UPDATE ${table} SET
              r_name = ?,
              r_capacity = ?,
              r_detail = ?,
              r_image = ?,
              r_updated = NOW()
              WHERE 
                r_id = ?
            `
            await db.query($query,[
                value.r_name,
                value.r_capacity,
                value.r_detail,
                value.r_image,
                id
            ],(err, result) => {
                if(err) return reject(err)
                resolve(result)
            })
        })
    },
    onDelete(id) {
        return new Promise(async(resolve,reject) => {
            await db.query(`DELETE FROM ${table} WHERE r_id = ?`,id,(err,result) => {
                if(err) return reject(err)
                resolve(result.length > 0 ? result[0] :null)
            })
        })
    }
}