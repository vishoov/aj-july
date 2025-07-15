//we'll be using user data to build our application

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

const User = mongoose.model("User", userSchema) //this creates a model called User using the userSchema


module.exports = User; //this exports the User model so that it can be used in other files

