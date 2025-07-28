const express= require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");


router.get("/", async (req, res)=>{
    res.status(200).send("welcome to the user routes")
})


mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
    res.status(500).send("Internal Server Error");
})






module.exports = router;