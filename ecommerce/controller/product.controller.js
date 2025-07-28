const Product = require("../model/product.model");
const { search } = require("../view/user.routes");


const createProduct = async (req, res)=>{
    try{
        const { name, description, costprice, saleprice, category, stock } = req.body;

        // Validate required fields
        if(!name || !description || !costprice || !saleprice || !category || stock === undefined) {
            return res.status(400).send("All fields are required");
        }

        // Create a new product instance
        const newProduct = new Product({
            name,
            description,
            costprice,
            saleprice,
            category,
            stock

        })
        // Save the product to the database
        await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });

    }
    catch(err){
        console.error("Error creating product:", err);
        res.status(500).send("Internal Server Error");
    }
}



const allProducts = async (req, res)=>{
    try{
        const products = await Product.find({});

        if(products.length === 0){
            return res.status(404).send("No products found");
        }

        res.status(200).json({
            message:"products fetched successfully",
            products: products
        })
    }
    catch(err){
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
    }
}

const updateProduct = async (req, res)=>{
    try{
        const { id } = req.params;

        const { name, description, costprice, saleprice, category, stock } = req.body;

        if(!name || !description || !costprice || !saleprice || !category || stock === undefined) {
            return res.status(400).send("All fields are required");
        }

        //find the product
        const product = await Product.findById(id);

        //if the product does not exist or the id is invalid 
        if(!product){
            return res.status(404).send("Product not found");
        }

        //update the product 
        product.name = name;
        product.description = description;
        product.costprice = costprice;
        product.saleprice = saleprice;
        product.category = category;
        product.stock = stock;

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product: product
        })

    }
    catch(err){
        res.status(500).send(err.message);
    }
}

const deleteProduct = async (req, res)=>{
    try{
        const { id } = req.params;

        //delete the product 
        const product = await Product.findByIdAndDelete(id);

        //the product does not exist
        if(!product){
            return res.status(404).send("Product not found");
        }

        res.status(200).json({
            message:"Product deleted successfully",
            product: product
        })
    }
    catch(err){
        console.error("Error deleting product:", err);
    }
}

const searchProduct = async (req, res)=>{
    try{
        const { query } = req.query;

        const products = await Product.find({
            $or:[
                {name: { $regex:query, $options: 'i'}}, //case sensitive search
                {description: { $regex:query, $options: 'i'}},
                {category: { $regex:query, $options: 'i'}}
            ]
        })

        if(products.length===0){
            return res.status(404).send("No products found");
        }

        res.status(200).json({
            message: "Products found",
            products: products
        })
    }
    catch(err){
        console.error("Error searching product:", err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    createProduct,
    allProducts,
    updateProduct,
    deleteProduct,
    searchProduct
}