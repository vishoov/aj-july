const express = require('express');
const router = express.Router();
const Product = require('../model/product.model');
const { createProduct, allProducts, updateProduct, deleteProduct, searchProduct } = require('../controller/product.controller');

// Create product /createproduct
router.post("/createproduct", createProduct)

// Fetch All Product /products
router.get("/products", allProducts)


// Update Product /updateProduct
router.put("/updateProduct/:id", updateProduct)


// Delete Product /deleteProduct
router.delete("/deleteProduct/:id", deleteProduct)


// Search /searchProduct
router.get("/searchProduct", searchProduct)


module.exports = router;