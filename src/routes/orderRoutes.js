const express = require('express');
const {
    createOrder,
    getOrders,
    getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Flow: JWT -> protect (Identify user) -> createOrder -> Order Model -> MongoDB
router.post('/', protect, createOrder);

// View orders (Protected)
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;