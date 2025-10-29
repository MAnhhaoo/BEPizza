const express = require("express")
const dotenv = require ("dotenv")
const routes = require ('./Routes')
const cors = require('cors')
const { default: mongoose } = require("mongoose")
const bodyParser = require("body-parser")
dotenv.config()
const app = express() 
const path = require("path");
const port = process.env.PORT || 3002
// dùng để lấy req trong body
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors())
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
