const express = require("express");
const app = express();
const mongoose = require("mongoose");

const uri = "mongodb+srv://vverma971:pzihf9jAD7ApmWnJ@cluster0.ifbbpdv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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





app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})