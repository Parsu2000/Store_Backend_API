const mongoose = require('mongoose');

// Define the Product Schema structure
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Product Model (creates 'products' collection)
const Product = mongoose.model('Product', productSchema);

module.exports = Product;