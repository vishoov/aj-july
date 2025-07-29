const express = require("express");
const app = express();
const userRoutes = require("./view/user.routes")
const productRoutes = require("./view/product.routes")
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const cartRoutes = require("./view/cart.routes")
const orderRoutes = require("./view/order.routes");



mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


app.use(express.json());
const cors = require("cors");
app.use(cors());


const limiter = rateLimit({
    windowMs:15*60*1000, // 15 minutes,
    max:100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
})


app.use(limiter);




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
app.use("/cart", cartRoutes)
app.use("/order", orderRoutes)


app.listen(3000, ()=>{
    try{
        console.log("Server is running on port 3000")
    }
    catch(err){
        console.error("Error starting server:", err);
    }
})