const express= require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const User = require("../model/user.model");
const { createToken, verifyToken } = require("../auth/jwt.auth")



router.get("/", async (req, res)=>{
    res.status(200).send("welcome to the user routes")
})


router.get("/users", verifyToken, async (req, res)=>{
    try{
        
        const users = await User.find({});
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


router.post("/signup", async (req, res)=>{
    try{
        let {name, email, password, age, address, contact } = req.body;
        // Input sanitization to prevent XSS attacks
        // email = xss(email);
        // name = xss(name);
        // password = xss(password);
        // age = xss(age);

        //Input Validation

        if(!name || !email || !password || !age) {
            return res.status(400).json({ error: "All fields are required" });
        }




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
            address, 
            contact,
            role: "user" // Default role
            
        })

        const token = await createToken(user);

        await user.save(); //this saves the user to the database
        
        // const token = createToken(user)


        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                age: user.age,
                password: user.password, //password will not be returned if select:false is set in the schema
                email: user.email,
                role: user.role,
                address: user.address,
                contact: user.contact
            },
            token:token
        })

        // const user = new User({})
        //await user.save();
    }
    catch(err){
        console.error("Error during signup:", err);
        res.status(500).send(err.message);
    }
})

router.post("/login", async (req, res)=>{
    try{
        const {email, password}= req.body;

        //find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
            message: "User not found"
            });
        }

        //in case user is not found
        if(!user){
            res.status(404).json({
                message: "User not found"
            })
        }

        //check if the password is correct
        if(!await user.comparePassword(password)){
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // if(user.password !==password){
        //     return res.status(401).json({
        //         message: "Invalid password"
        //     });
        // }

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


router.get("/logout", async (req, res)=>{
    try{
        // In a real application, you would invalidate the user's session or token here
        res.status(200).json({
            message: "Logout successful"
        });
    }catch(err){
        console.error("Error during logout:", err);
        res.status(500).send(err.message);
    }
})

router.get("/profile/:id", async (req, res)=>{
    try{
        const { id } = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message:"User profile fetched successfully",
            user:{
                id: user._id,
                name: user.name,
                age: user.age,
                email: user.email,
                role: user.role,
                address: user.address,
                contact: user.contact
            }
        })
    }
    catch(err){
        console.error("Error fetching user profile:", err);
        res.status(500).send(err.message);
    }
})


module.exports = router;