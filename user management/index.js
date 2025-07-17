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
app.delete("/deleteUser", async (req, res)=>{
    try{
        const email = req.body.email;

        const deletedUser = await User.deleteOne({
            email
        })
        console.log(deletedUser)

        if(deletedUser.deletedCount===0){
            res.send("Nothing deleted")
        }

        res.status(200).json({
            message:"User deleted successfuly",
            user:deletedUser
        })
    }
    catch(err){
        res.status(500).send(err.message)
    }
})


app.put("/updateUser", async (req, res) => {
    try {
        const name = req.body.name;
        const new_email = req.body.new_email;

        // Input validation
        if (!name || !new_email) {
            return res.status(400).json({ error: "Name and new_email are required" });
        }

        // const result = await User.updateOne(
        //     { name: name }, //filter
        //     { $set: { email: new_email } }, //update values
        //     { 
        //         runValidators: true  //options
        //     }
        // );

        // if (result.matchedCount === 0) {
        //     return res.status(404).json({ error: "User not found" });
        // }

        // if (result.modifiedCount === 0) {
        //     return res.status(200).json({ message: "No changes made - email might be the same" });
        // }

            //------------------------------findOneAndUpdate()------------------------
            const updatedUser = await  User.findOneAndUpdate(
                {
                    name:name
                },
                {
                    $set:{
                        email:new_email
                    }
                },
                {
                    new:true,
                    runValidators:true
                }
            )

            if(!updatedUser){
                return res.status(400).send("Nothing updated")
            }




        res.status(200).json({ 
            message: "User updated successfully",
          
            updatedUser:updatedUser
        });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put("/updateMany", async (req, res)=>{
    try{
            const name = req.body.name;
            const updatedName = req.body.new_name;

            const result = await User.updateMany(
                {
                    name:name
                },
                {
                    $set:{
                        name:updatedName
                    }
                },{
                    runValidators:true
                }
            )

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "User not found" });
            }
    
            if (result.modifiedCount === 0) {
                return res.status(200).json({ message: "No changes made - email might be the same" });
            }
    
            res.status(200).json({ 
                message: "Users updated successfully",
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,

            });


    }
    catch(err){
        res.status(500).send(err.message)
    }
})

app.put("/updateById/:id", async (req, res)=>{
    try{
        const id = req.params.id;
        const {email, password}=req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set:{
                    email:email,
                    password:password
                }
            },
            {
                new:true,//deletes all the old data in the document and creates a new document altogether
                runValidators:true
            }
        )

        if(!updatedUser){
            res.status(404).send("The product wasnt updated")
        }

        res.status(200).send({
            message:"The user is updated successfully",
            updatedUser
        })

    }
    catch(err){
        res.status(400).send(err.message)
    }
})

app.get("/aggregate", async (req, res)=>{
    try{
        const result = await User.aggregate(
            [
                {
                    $match:{
                        $and:[
                            {
                                age:{
                                    $gt:18
                                }
                            },
                            {
                                role:"user"
                            }
                        ]
                    }
                }
            ]
        )

        res.status(200).json({
            message:"Aggregation Done",
            result:result
        })

    }
    catch(err){
        res.status(500).send(err.message)
    }
})

app.get("/aggregate2", async (req, res)=>{
    try{    
            const result = await User.aggregate([
                {
                    $match:{
                        $and:[
                            {
                                age:{
                                    $exists:true
                                }
                            },
                            {
                                age:{
                                    $lt:50
                                }
                            }
                        ]
                    }
                }
            ])

            res.status(200).json({
                result:result
            })

    }
    catch(err){
        res.send("Error")
    }
})

app.get("/role_count", async (req, res)=>{
    try{
        const result = await User.aggregate([
            {
                $group:{
                    //condition based on which the data will be grouped
                    _id:"$role",
                    count:{
                        $sum:1
                    }

                }
            },
            {
                $project:{
                    _id:0,
                    role:"$_id",
                    User_Count:"$count"
                }
            },
            {
                $sort: {
                    User_Count:-1
                    //1 means ascending 
                    //-1 means descending
                }
            },
            {
                $skip:1
            },
            {
                $limit:2
            }
        ])

        res.json({
            result:result
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error"
        })
    }
})




app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})