const mongoose = require("mongoose")
const userSchema = new mongoose.Schema(
    {
        name: {type : String },
        email: {type: String , unique: true},
        password :{type: String , required: true},
        isAdmin: {type : Boolean , default: false },
        phone : {type: Number },
         isBlocked: { type: Boolean, default: false },
        address: {type: String},
        access_token : {type: String },
        refresh_token : {type : String },
    } , {
        timestamps : true
    }
);
// dùng để thao tác với MongoDB
const User = mongoose.model("User" , userSchema);
// xuất file đi mọi nơi 
module.exports = User