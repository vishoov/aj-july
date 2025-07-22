//we'll be using user data to build our application
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');


//name, email, password, role


const userSchema = new mongoose.Schema({

    name:{
        type:String, //this tells mongoose that this field is a string
        required:[true, "This field is required"], //this makes the field required meaning that without this field the user cannot be created
        trim:true //this removes any extra spaces before or after the string

    },
    email:{
        type:String,
        required:[true, "Email is required to signup "],
        unique:true, //this makes sure that the email is unique and cannot be used by another user
        lowercase:true, //this converts the email to lowercase
        trim:true, //this removes any extra spaces before or after the string
    //     validate:{
    //         validator: function(v){
    //             return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
    //             //RegEx -> this is a regular expression that checks if the email is in the correct format
    //             //regex is used to match patterns in strings 
    //             //name@povider.com

    //         },
    //         message:"The email is not in the correct format"
    // }
    match:[/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, "The email is not in the correct format"]
},
    password:{
        type:String,
        required:[true, "Password is required to signup"],
        minLength:[6, "Password must be at least 6 characters long"],
        maxLength:[20, "Password must be at most 20 characters long"],
        // select:false //this means that the password will not be returned when the user is fetched from the db
    },
    age:{
        type:Number,
        required:[true, "Age is required to signup"],
        min:[0, "You must be at least 0 years old to signup"], //this makes sure that the user is at least 18 years old
        max:[100, "You must be less than 100 years old to signup"] //this makes sure that the user is less than 100 years old
    },
    role:{
        type:String,
        //role can be one of the following: user, admin, superadmin
        enum:["user", "admin", "superadmin"], //this means that the role can only be one of these values
        //enum-> enumeration this defines a set of possible values for the role field
        default:"user",
        //default value is user
        required:true //this makes the field required meaning that without this field the user cannot be created
    }

})

//bcrypt password hashing or password encryption
//we need to define a middleware that works between the user creation and the user saving to the database
//this middleware will hash the password before saving the user to the database
userSchema.pre('save', async function(next){
    try{
        //first we check if the password is modified or not
        if(!this.isModified('password')) return next();

        //if the password is modified, we hash the password
        const salt = await bcrypt.genSalt(10); //this generates a salt with 10 rounds
        // const salt = "$2b$10$eImiTMZG4T5xW7jZ6k9aOe"; //this is a hardcoded salt for demonstration purposes, in production you should generate a new salt every time

        this.password = await bcrypt.hash(this.password, salt);
        //this hashes the password using the salt

        next(); //this calls the next middleware in the chain
    }
    catch(err){
        next(err); //if there is an error, we pass it to the next middleware
    }
})

//we will define a method to compare the password entered by the user with the hashed password in the database
userSchema.methods.comparePassword = async function(userPassword){
    try{
        //i will match the password entered by the user with the hashed password in the database using bcrypt's compare method
        return await bcrypt.compare(userPassword, this.password)
    }
    catch(err){
        throw new Error(err); //if there is an error, we throw it
    }
}

const User = mongoose.model("User", userSchema) //this creates a model called User using the userSchema


module.exports = User; //this exports the User model so that it can be used in other files

