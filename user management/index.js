const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./model/user.model.js");

const uri = "mongodb+srv://vverma971:pzihf9jAD7ApmWnJ@cluster0.ifbbpdv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.use(express.json()); //this middleware is used to parse the incoming request body as JSON


mongoose.connect(uri)
    .then(()=>{
        console.log("Connected to MongoDB")
    })
    .catch((err)=>{
        console.error("Error connecting to MongoDB:", err);
    })






app.get("/", (req, res)=>{
    res.send("Welcome to the User Management System");
})

//async and await 
//database is 3rd party service so we need to use async and await to handle the asynchronous nature of the database operations
app.post("/signup", async (req, res)=>{
    try{
        const {name, email, password, role, age } = req.body;

        // const user = await User.create({
        //     name,
        //     email,
        //     password,
        //     role
        // })

        const user = new User({
            name,
            email,
            age,
            password,
            role
        })

        await user.save(); //this saves the user to the database
        
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                age: user.age,
                email: user.email,
                role: user.role
            }
        })

        // const user = new User({})
        //await user.save();
    }
    catch(err){
        console.error("Error during signup:", err);
        res.status(500).send(err.message);
    }
})


app.get("/users", async (req, res)=>{
    try{
        
        const users = await User.find({
          age:{
            $type: "number" //this checks if the age field is a number
          }
        });
        res.status(200).json({
            message: "Users fetched successfully",
            users: users

        });

    }
    catch(err){
        console.error("Error fetching users:", err);
        res.status(500).send(err.message);
    }
})

//to login the user
app.post("/login", async (req, res)=>{
    try{
        const {email, password}= req.body;

        //find the user by email
        const user = await User.findOne({email:email});

        //in case user is not found
        if(!user){
            res.status(404).json({
                message: "User not found"
            })
        }

        //check if the password is correct
        if(user.password!==password){
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                age: user.age,
                email: user.email,
                role: user.role
            }
        });


    }catch(err){
        console.error("Error during login:", err);
        res.status(500).send(err.message);
    }
})

//to logout the user


//to find the user by id



//to delete the user 



//to update the user information






app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})