const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema (
    {
        // vì sản phẩm có thể mua 2 3 cái nên phải cho vô cái mảng 
        
        orderItem : [
            {
                name : {type : String , required: true},
                amount : {type : Number , required : true},
                image : {type : String , required : true},
                price : {type : Number , required : true},
                product : {
                    // giống như là join bảng 
                    type : mongoose.Schema.Types.ObjectId,
                    ref : 'Product',
                    required : true
                },
            },
        ] , 
        shippingAddress : {
         fullName : {type : String , required : true},   
         address : {type : String , required : true},   
         city : {type : String , required : true},   
         phone : {type : Number , required : true},   
        },
        itemPrice : {type : Number , required : true},
        shippingPrice : {type : Number , required : true},
        taxPrice : {type : Number , required: true},
        totalPrice : {type : Number , required: true},
        user : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required: true},
        isPaid : {type : Boolean , required: true},
        isPaid : {type : Date },
        isDelivered : {type : Date , default: false },
        deliveredAt : {type : Date },
    }
);
const Order = mongoose.model( "Order",OrderSchema )
module.exports = Order