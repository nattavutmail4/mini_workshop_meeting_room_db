const db = require('../config/databases')
const { password_hash, password_verify } = require('../config/security')
const moment = require('moment');
const table = {
    bk: "tb_bookings",
    bkeq: "tb_bookings_has_tb_equipments"
};
const formattedDate = (dateObject) => {
  const format = moment(dateObject, 'MM/DD/YYYY, HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
  return format
};
  
module.exports = {
    findHistory(value, tb_users_u_id, u_role) {
        return new Promise(async (resolve, reject) => {
            const limitPage = 10; //กำหนดแสดงข้อมูลสูงสุดต่อหน้า
            const startPage = ((value.page || 1) - 1) * limitPage; //สูตรหาจำนวนหน้า
            const sqls = {
                count:"",
                select:""
            }
            if (u_role !== 'user') {
                  sqls.count  = `SELECT COUNT(*)  FROM ${table.bk} `;
                  sqls.select = `SELECT * FROM ${table.bk} `;
            } else {
                sqls.count  = `SELECT COUNT(*) FROM ${table.bk} WHERE tb_users_u_id = ${db.escape(tb_users_u_id)} `;
                sqls.select = `SELECT * FROM ${table.bk} WHERE tb_users_u_id = ${db.escape(tb_users_u_id)} `;
            }

            if (value.search_key && value.search_text) {
                const key = value.search_key
                const txt = value.search_text
                if (u_role !== 'user') {
                    const sqlSearch = ` WHERE ${db.escapeId(key)}  LIKE ${db.escape(`%${txt}%`)}`
                    sqls.count += sqlSearch
                    sqls.select += sqlSearch
                } else {
                    const sqlSearch = ` AND ${db.escapeId(key)}  LIKE ${db.escape(`%${txt}%`)}`
                    sqls.count += sqlSearch
                    sqls.select += sqlSearch
                }
               
            }
            // // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY bk_created DESC'
            // console.log(sqls)
            
            // //หาจำนวนแถว
            await db.query(sqls.count, (error, result) => {
                if (error) return reject(error)
                const items = { result: [], rows: result[0]['COUNT(*)'], limit: limitPage }; // result หาข้อมูล result.length หาแถวข้อมูล
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
    findByRoomId(roomid) {
        return new Promise(async (resolve, reject) => {
            await db.query(`SELECT * FROM ${table.bk}  WHERE tb_rooms_r_id = ? and bk_status <> 'not allowed'`, [roomid], (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
    },
    find(value) {
        return new Promise(async (resolve, reject) => {
            const limitPage = 10; //กำหนดแสดงข้อมูลสูงสุดต่อหน้า
            const startPage = ((value.page || 1) - 1) * limitPage; //สูตรหาจำนวนหน้า
            const sqls = {
                count: `SELECT COUNT(*) as 'rows'  FROM ${table.bk} `, //sql นับจำนวนข้อมูลทั้งหมด
                select: `SELECT * FROM ${table.bk}` //เลือกข้อมูลทั้งหมด
            }

            if (value.search_key && value.search_text) {
                const key = value.search_key
                const txt = value.search_text
                const sqlSearch = ` AND ${db.escapeId(key)}  LIKE ${db.escape(`%${txt}%`)}`
                sqls.count += sqlSearch
                sqls.select += sqlSearch
            }
            // console.log(sqls)
            // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY bk_created DESC'

            //หาจำนวนแถว
            await db.query(sqls.count, (error, result) => {
                if (error) return reject(error)
                const items = { result: [], rows: result[0].rows, limit: limitPage }; // result หาข้อมูล result.length หาแถวข้อมูล
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

    //ค้นหาข้อมูลโดยระบุ id
    findById(id) {
        return new Promise(async (resolve, reject) => {
            await db.query(`SELECT * FROM ${table.bk} WHERE bk_id =?`, [id], (err, result) => {
                if (err) reject(err)
                resolve(result.length > 0 ? result[0] : null)
            })
        })
    },
    findByCheckDateTime({bk_time_start, bk_time_end, tb_rooms_r_id}) {
        return new Promise(async (resolve, reject) => {
          const start = formattedDate(new Date(bk_time_start));
          const end = formattedDate(new Date(bk_time_end));
          const sqls = {
            select: `
              SELECT COUNT(*) AS bk_count FROM ${table.bk} 
              WHERE 
                tb_rooms_r_id = ${tb_rooms_r_id}
              AND
                (
                    bk_time_start BETWEEN ${db.escape(start)} AND ${db.escape(end)} 
                    OR 
                    bk_time_end BETWEEN ${db.escape(start)} AND ${db.escape(end)}
                )
            `,
          };
      
          //console.log(sqls.select);
      
          await db.query(sqls.select, (err, result) => {
            if (err) return reject(err);
            resolve(result.length > 0 ? result[0] : 0);
          });
        });
      },
      
    onCreate(value) {
        return new Promise((resolve, reject) => {
            // ตรวจสอบวันว่ามีการจองวันที่เลือกไปแล้ว หรือ ยัง
            this.findByCheckDateTime(value)
            .then((checkInvalid) => {
                if(checkInvalid.bk_count != 0){
                    const error = new Error('ไม่สามารถในจองห้องประชุมนี้ได้ เนื่องจากมีการจองในช่วงเวลาดังกล่าว');
                    error.code = 400; // เพิ่มโค้ดสถานะข้อผิดพลาด 400 (Bad Request) เป็นตัวแปร error
                    reject(error);
                } else {
                    db.beginTransaction(tsError => {
                        if (tsError) return reject(tsError);
                         //บันทึกข้อมูลเข้าตาราง tb_bookings
                        const bkModel = {
                            bk_title: value.bk_title,
                            bk_detail: value.bk_detail,
                            bk_time_start: new Date(value.bk_time_start),
                            bk_time_end: new Date(value.bk_time_end),
                            tb_users_u_id: value.tb_users_u_id,
                            tb_rooms_r_id: value.tb_rooms_r_id
                        }
        
                       // ตรวจสอบวันที่เริ่มต้นน้อยกว่าวันที่สิ้นสุด
                        if (bkModel.bk_time_start >= bkModel.bk_time_end) {
                            const error = new Error('เลือกวันที่เริ่มต้องไม่มากกว่าวันที่สิ้นสุด');
                            error.code = 400; // เพิ่มโค้ดสถานะข้อผิดพลาด 400 (Bad Request) เป็นตัวแปร error
                            reject(error);
                        } 
        
                        db.query(`INSERT INTO ${table.bk} SET ? `, bkModel, (bkError, bkResult) => {
                            if (bkError) {
                                db.rollback()
                                return reject(bkError)
                            }
        
                    //         //บันทึกข้อมูลเข้าตาราง tb_bookings_has_tb_equipments
                            const tb_bookings_bk_id = bkResult.insertId;
                            const bkeqModel = [];
                            value.equipments.forEach(tb_equipments_eq_id => {
                                bkeqModel.push([tb_bookings_bk_id, tb_equipments_eq_id])
                            })
        
                    //         //ถ้าไม่มีการเลือกอุปกณ์ห้องประชุมให้ resolve ไป
                            if (bkeqModel.length <= 0) {
                                return db.commit(cmError => {
                                    if (cmError) {
                                        db.rollback()
                                        return reject(cmError)
                                    }
                                    resolve(bkResult)
                                })
                            }
        
                            db.query(`INSERT INTO ${table.bkeq} (tb_bookings_bk_id, tb_equipments_eq_id) VALUES ?`, [bkeqModel], (bkeqError, bkeqResult) => {
                                if (bkeqError) {
                                    db.rollback()
                                    return reject(bkeqError)
                                }
                                db.commit(cmError => {
                                    if (cmError) {
                                        db.rollback()
                                        return reject(cmError)
                                    }
                                })
                                resolve(bkeqResult)
                            })
                        })
        
                    })
                }

            


            }).catch(reject)
         
        })
    },

    onUpdate(value, id) {
        return new Promise(async (resolve, reject) => {
            await db.query(`UPDATE ${table.bk} SET ? , bk_updated = NOW() WHERE bk_id = ${db.escape(id)}`, value, (error, result) => {
                if (error) return reject(error)
                resolve(result)
            })
        })
    },

    onDelete(id) {
        return new Promise(async (resolve, reject) => {
            //ค้นหาข้อมูลว่ามีการขอยืมอุปกรณ์หรือไม่
            await db.query(`SELECT * FROM ${table.bkeq} WHERE tb_bookings_bk_id=?`, [id], (err, result) => {
                if (err) reject(err)
                // ถ้ามีการขอยืมอุปกรณ์
                if (result.length > 0) {
                      //ให้ทำการลบ table การจองก่อน
                      db.query(`DELETE  FROM ${table.bk} WHERE bk_id =?`, [id] ,(err, result_bk) => {
                         if(err) return reject(err)
                         //ถ้าลบการจองสำเร็จให้ไปลบ table ที่มีการยืมอุปกรณ์
                         if(result_bk.affectedRows > 0) {
                            db.query(`DELETE FROM ${table.bkeq} WHERE tb_bookings_bk_id =?`,  [id], (err,result_bkeq) => {
                                if(err) return reject(err)
                                resolve(result_bkeq)
                            } )
                         }
                      })
                } else {
                    // ถ้าไม่มีการยืมอุปกณ์ให้ทำการลบแค่ห้องที่จอง
                    db.query(`DELETE FROM ${table.bk} WHERE bk_id = ?`, id, (err, result) => {
                        if (err) return reject(err)
                        resolve(result)
                    })
                }
            })
        })
    }
}