const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

// 	Name:string,
name:{
    type:String,
    required:true,
    trim:true
},
// description:string,
description:{
    type:String,
    required:true,
    trim:true
},
// Costprice:number,
costprice:{
    type:Number,
    required:true,
    min:0
},
// saleprice:number,
saleprice:{
    type:Number,
    required:true,
    min:0
},
// Category:string,
category:{
    type:String,
    required:true,
    enum:["electronics", "clothing", "accessories", "home-appliances", "books", "toys", "sports"],
    default:"electronics",
    trim:true
},

// Stock:number,
stock:{
    type:Number,
    required:true,
    min:0,
    default:0
},
// image:[String] -> cdn links front end 
image:[
    {
        type:String,
        required:false,
        trim:true,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    }
]
// createdAt:date

},
{
    timestamps: true
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;