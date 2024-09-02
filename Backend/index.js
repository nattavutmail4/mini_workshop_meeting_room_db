const express = require('express')
const expressSession = require('express-session')
const cors = require('cors')
const {PORT , SECRET }  = require('./config/configs')

const app = express()
app.disable('x-powered-by')

app.use(cors())
//limit ขนาดไฟล์ที่ส่งไม่เกิน 500 mb
app.use(express.urlencoded({extended:false, limit:"500MB"})) 
app.use(express.json({ limit: '500MB' }))

// allow content อนุญาตให้เข้าถึง folder
app.use('/api/uploads',express.static(`./uploads/equipments`))
app.use('/api/uploads',express.static(`./uploads/rooms`))


app.use(expressSession({
    secret:SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{}
}))


app.use('/api',require('./routes'))
  


app.use((req, res, next) => {
    res.status(404).json({
        msg:"Not Found Endpoint API"
    })
    next();
})

app.listen(PORT, () => console.log(`Run Backend on Port: ${PORT}`))


