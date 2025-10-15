các lệnh cài : 
npm init
npm i express dotenv cors body-parser bcrypt jsonwebtoken 
chạy npm i nodemon
tạo src gồm index.js models routes service controller
trong file index.js tạo 
const express = require("express")
const dotenv = require ("dotenv")
dotenv.config()
const app = express() 
const port = process.env.PORT || 3002

app.listen(port , ()=>{
    console.log("running port 3002" , + port)
})

các bước connect database vô mongodb
