const express = require('express');
const {
    createOrder,
    getOrders,
    getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Any logged-in user (including anudeep) can create and view their orders
router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;