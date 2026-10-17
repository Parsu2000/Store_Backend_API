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

// Public / User / Manager / Admin: View products
router.get('/', getProducts);
router.get('/:id', getProductById);

// Manager & Admin: Create and Update products
router.post('/', protect, authorizeRoles('manager', 'admin'), createProduct);
router.put('/:id', protect, authorizeRoles('manager', 'admin'), updateProduct);

// Admin only: Delete products
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;