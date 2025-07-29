const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

// userID:string,
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
products:[
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        }
    }
],
// Items:[{
// 	productID:string,
// 	Quantity:number,
// 	Price:number
// }]
totalAmount:{
    type:Number,
    required:true,
    default:0
},
// 	totalAmount:Number,
shippingAddress:{
    type:String,
    required:true
},
status:{
    type:String,
    enum:["Pending", "Shipped", "Delivered", "Cancelled"],
    default:"Pending"
}
// 	shippingAddress:String,
// 	Status:string,

})

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;