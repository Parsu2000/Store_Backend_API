const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Any authenticated user)
const createOrder = async (req, res) => {
    try {
        const { products, totalAmount, status } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one product"
            });
        }

        let calculatedTotal = totalAmount;
        if (calculatedTotal === undefined) {
            calculatedTotal = 0;
            for (const item of products) {
                const productDoc = await Product.findById(item.product);
                if (!productDoc) {
                    return res.status(404).json({
                        success: false,
                        message: `Product not found with ID: ${item.product}`
                    });
                }
                calculatedTotal += productDoc.price * (item.quantity || 1);
            }
        }

        const order = new Order({
            user: req.user._id,
            products,
            totalAmount: calculatedTotal,
            status: status || 'pending'
        });

        const savedOrder = await order.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: savedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// @desc    Get orders (Manager/Admin -> All orders | User/Others -> Own orders)
// @route   GET /api/orders
// @access  Private (Any authenticated user)
const getOrders = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role !== 'manager' && req.user.role !== 'admin') {
            filter = { user: req.user._id };
        }

        const orders = await Order.find(filter)
            .populate('user', 'name email role')
            .populate('products.product', 'name price category')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            role: req.user.role,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Manager/Admin -> Any order | User/Others -> Own order)
const getOrderById = async (req, res) => {
    try {
        // 1. Validate if ID is a valid MongoDB ObjectId -> Return 400 if invalid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID format"
            });
        }

        const order = await Order.findById(req.params.id)
            .populate('user', 'name email role')
            .populate('products.product', 'name price category');

        // 2. Order not found -> Return 404
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // 3. Ensure regular users can only view their own order
        if (
            req.user.role !== 'manager' &&
            req.user.role !== 'admin' &&
            order.user._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You can only view your own orders"
            });
        }

        // 4. Valid order -> Return 200
        res.status(200).json({
            success: true,
            data: order
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
    createOrder,
    getOrders,
    getOrderById
};