const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

name:{
    type:String,
    required:true,
    trim:true
},
    // 	Name:string,
  age:{
    type:Number,
    required:true,
    min:0

  },
    // Age:number,
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate:{
            validator: function(v){
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props=> `${props.value} is not a valid email address!`
        }
    },
    // Email:string,
    address:{
        type:String,
        required:true,
        trim:true
    },
    // Address:string,
    contact:{
        type:Number,
        required:true,
        minLength: 10,
        maxLength: 10,
    },
    // Contact:number,
    
    role:{
        type:String,
        required:true,
        enum:["user", "admin", "superadmin"],
        default:"user"   
    },
    password:{
        type:String,
        required:true,
        minLength:[8, "Password must be atleast 8 characters long"],
        maxLength:[20, "Password must be less than 20 characters long"],
    }
        // Role:”user”, “admin”, -> role based authentication 
    // Password:string
})

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    }
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}


const User = mongoose.model("User", userSchema);

module.exports = User;
