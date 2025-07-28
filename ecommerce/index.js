const express = require("express");
const app = express();
const userRoutes = require("./view/user.routes")
const productRoutes = require("./view/product.routes")

app.use(express.json());


app.get("/", async (req, res)=>{
    try {
        res.status(200).send("Hello World");
    } catch (err) {
       
        res.status(500).send("Internal Server Error");
    }
})

//Routes are mounted here

app.use("/user", userRoutes)
app.use("/product", productRoutes)

app.listen(3000, ()=>{
    try{
        console.log("Server is running on port 3000")
    }
    catch(err){
        console.error("Error starting server:", err);
    }
})