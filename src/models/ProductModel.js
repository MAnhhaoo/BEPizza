const mongoose = require ('mongoose')
const productSchema = new mongoose.Schema (
    {
        name: {type : String , unique: true ,required: true},
        image: {type: String , required: true},
        type :{type: String , required: true},
        price: {type : Number , default: false },
        countInStock : {type: Number },
        rating : {type: Number , required : true},
        description : {type : String , required: true},
    } , {
        timestamps : true
    }
    
);
const Product = mongoose.model("Product" , productSchema);
module.exports = Product