const express = require("express");
const router = express.Router();
const { addToCart, deleteFromCart, fetchCart } = require("../controller/cart.controller");

// Add to cart
router.post("/add", addToCart);

// Delete From Cart
router.delete("/delete/:cartId", deleteFromCart)


// Fetch Cart
router.get("/:userId", fetchCart)

module.exports = router;