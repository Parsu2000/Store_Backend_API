const express = require('express');
const { 
    createProduct, 
    getProducts, 
    getProductById,
    updateProduct,
    deleteProduct 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (Anyone can view products)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Require valid Bearer token)
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;