const Cart = require("../model/cart.model");
const Product = require("../model/product.model");

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate quantity is a positive number
        if (quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be greater than 0" });
        }

        // Check if the cart already exists for the user
        let cart = await Cart.findOne({ userId });

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const price = product.saleprice;

        // Validate price is a valid number
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: "Invalid product price" });
        }

        if (!cart) {
            // If the cart doesn't exist, create a new cart
            cart = new Cart({
                userId,
                products: [{
                    productId,
                    price,
                    quantity
                }],
                totalAmount: price * quantity
            });

            await cart.save();
        } else {
            // If the cart exists, check if the product already exists in the cart
            const existingProduct = cart.products.find(item => 
                item.productId.toString() === productId
            );

            if (existingProduct) {
                // Update existing product quantity
                existingProduct.quantity += quantity;
                cart.totalAmount += price * quantity;
            } else {
                // Add new product to cart
                cart.products.push({
                    productId,
                    price,
                    quantity
                });
                cart.totalAmount += price * quantity;
            }

            await cart.save();
        }

        res.status(200).json({
            message: "Product added to cart successfully",
            cart: cart
        });

    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ 
            error: err.message || "Internal Server Error" 
        });
    }
}

const deleteFromCart = async (req, res)=>{
    try{
        const { cartId } = req.params;

        if (!cartId) {
            return res.status(400).json({ error: "Cart ID is required" });
        }

        const { productId, quantity } = req.body;

        const producttoDelete = await Product.findById(productId);
        if (!producttoDelete) {
            return res.status(404).json({ error: "Product not found" });
        }



        const cart = await Cart.findById(cartId);

        if(!cart){
            return res.status(404).json({ error: "Cart not found" });
        }

        // Check if the product exists in the cart
        const productIndex = cart.products.findIndex(item =>
            item.productId.toString()=== productId
        )

        if(productIndex===-1){
            return res.status(404).json({ error: "Product not found in cart" });
        }

        // Remove the product from the cart
        const product= cart.products[productIndex];
        cart.products.splice(productIndex, 1);

        // Update the total amount
        cart.totalAmount -= producttoDelete.saleprice*product.quantity;
        if (cart.totalAmount < 0) {
            cart.totalAmount = 0; // Ensure total amount doesn't go negative
        }

        await cart.save();

        res.status(200).json({
            message: "Product removed from cart successfully",
            cart: cart
        });

    }
    catch(err){
        console.error("Error deleting from cart:", err);
        res.status(500).json({ 
            error: err.message || "Internal Server Error" 
        });
    }
}

const fetchCart = async (req, res)=>{
    try{
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId});


        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            cart: cart
        });
    }
    catch(err){
        console.error("Error fetching cart:", err);
        res.status(500).json({ 
            error: err.message || "Internal Server Error" 
        });
    }
}

module.exports = {
    addToCart,
    deleteFromCart,
    fetchCart
}
