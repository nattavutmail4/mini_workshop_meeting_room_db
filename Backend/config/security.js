const bcrypt = require('bcrypt');

module.exports = {
    async password_hash(password) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    },

    async password_verify(password, hashedPassword) {
        const check = await bcrypt.compare(password, hashedPassword);
        return check
    },

    authenticator( req, res, next) {
        try {
            // req.session.userLogin = {
            //     // "u_id": 4,
            //     // "u_username": "admin",
            //     // "u_firstname": "Administrator",
            //     // "u_lastname": "Administrator",
            //     // "u_role": "admin"
    
            //     "u_id": 11,
            //     "u_username": "ttvone",
            //     "u_firstname": "Wanchaloem",
            //     "u_lastname": "Loaket",
            //     "u_role": "user"
            // }
            if(req.session.userLogin){
               return next();
            }
            res.status(401).json({msg:"Unauthorize."})
        } catch (error) {
            res.status(401).json({msg:'Unauthorize.'})
        }
    },
    //ตรวจสอบสิทธิ์
    isInRoles(roles = []) {
        // return next()
      return function (req, res, next) {
        try {
            if (roles.indexOf(req.session.userLogin.u_role) >= 0){
                return next();
            }else{
                throw new Error('Forbidden')
            }
           
        } catch (error) {
            
            return res.status(403).json({message:error.message})
        }
      }
    }
};
