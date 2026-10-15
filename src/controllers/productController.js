const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (or Protected/Admin later)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        // Create a new Product instance
        const product = new Product({
            name,
            description,
            price,
            category,
            stock
        });

        // Save the product to MongoDB
        const savedProduct = await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: savedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createProduct
};