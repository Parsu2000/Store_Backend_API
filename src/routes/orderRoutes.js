const express = require('express');
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// User, Manager, Admin: Create order
router.post('/', protect, authorizeRoles('user', 'manager', 'admin'), createOrder);

// Manager & Admin: View all orders
router.get('/', protect, authorizeRoles('manager', 'admin'), getOrders);

// User (own order), Manager, Admin: View order by ID
router.get('/:id', protect, authorizeRoles('user', 'manager', 'admin'), getOrderById);

// Admin only: Manage (Update & Delete) orders
router.put('/:id', protect, authorizeRoles('admin'), updateOrder);
router.delete('/:id', protect, authorizeRoles('admin'), deleteOrder);

module.exports = router;