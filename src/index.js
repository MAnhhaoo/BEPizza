const express = require("express")
const dotenv = require ("dotenv")
const routes = require ('./Routes')
const { default: mongoose } = require("mongoose")
const bodyParser = require("body-parser")
dotenv.config()
const app = express() 
const port = process.env.PORT || 3002
// dùng để lấy req trong body
app.use(bodyParser.json())
routes(app);



mongoose.connect(`${process.env.MONGO_DB}`).then(()=>{
    console.log("connect successfully")
}).catch((err)=>{
    console.log(err)
})

app.listen(port , ()=>{
    console.log("running port " , + port)
})