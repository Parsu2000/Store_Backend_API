const express = require('express');
const { 
    createProduct, 
    getProducts, 
    getProductById,
    updateProduct,
    deleteProduct 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Authenticated users)
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);

// Admin-only route: Request -> protect (401 check) -> authorizeRoles('admin') (403 check) -> deleteProduct
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;