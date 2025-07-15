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
        const {name, email, password, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        })
        
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
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


app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})