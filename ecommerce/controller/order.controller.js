const Order = require("../model/order.model");
const User = require("../model/user.model");



const placeOrder = async (req, res)=>{
    try{
        const { userId, products, totalAmount } = req.body;

        if(!userId || !products || !totalAmount) {
            return res.status(400).json({ error: "All fields are required" });
        }


        const user = await User.findById(userId);

        const shippingAddress = user.address;



        const order = new Order({
            userId,
            products,
            totalAmount,
            shippingAddress
        })

        await order.save();

        res.status(201).json({ message: "Order placed successfully", order });

    }
    catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ 
            error: err.message || "Internal Server Error" 
        });
    }
}


const cancelOrder= async(req, res)=>{
    try{
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({ error: "Order not found" });
        }

        if(order.status === "Cancelled") {
            return res.status(400).json({ error: "Order already cancelled" });
        }

        order.status="Cancelled";

        await order.save();

        res.status(200).json({ message: "Order cancelled successfully", order });
    }
    catch(err){
        console.error("Error cancelling order:", err);
        res.status(500).json({ 
            error: err.message || "Internal Server Error" 
        });
    }
}

const trackOrder = async (req, res)=>{
    try{
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({
            message: "Order tracked successfully",
            order:{
                shippingAddress: order.shippingAddress,
                status: order.status,
                totalAmount: order.totalAmount,
            }
        })
    }
    catch(err){
        console.error("Error tracking order:", err);
        res.status(500).json({ 
            error: err.message || "Internal Server Error" 
        });
    }
}

module.exports = {
    placeOrder,
    cancelOrder,
    trackOrder
}