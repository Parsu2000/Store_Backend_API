const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        // Basic validation for missing fields
        if (!name || !description || price === undefined || !category || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name, description, price, category, and stock are required"
            });
        }

        // Basic validation for invalid price or stock
        if (typeof price !== 'number' || price < 0 || typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Price and stock must be valid non-negative numbers"
            });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock
        });

        const savedProduct = await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: savedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        // Handle invalid MongoDB ObjectId format or database errors
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// @desc    Update product by ID
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        // Basic validation for invalid price or stock if provided in request
        if ((price !== undefined && (typeof price !== 'number' || price < 0)) ||
            (stock !== undefined && (typeof stock !== 'number' || stock < 0))) {
            return res.status(400).json({
                success: false,
                message: "Price and stock must be valid non-negative numbers"
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (category) updateData.category = category;
        if (stock !== undefined) updateData.stock = stock;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};