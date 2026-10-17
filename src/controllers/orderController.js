const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Authenticated User / Manager / Admin)
const createOrder = async (req, res) => {
    try {
        const { products, totalAmount, status } = req.body;

        // 1. Validate that products array exists and is not empty
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one product"
            });
        }

        // 2. Calculate totalAmount from DB if not explicitly sent in req.body
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

        // 3. Create order associated with the logged-in user (req.user._id)
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

// @desc    Get logged-in user's orders (or all orders for manager/admin)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        let query = {};
        // Regular users only see their own orders; managers & admins see all orders
        if (req.user.role === 'user') {
            query = { user: req.user._id };
        }

        const orders = await Order.find(query)
            .populate('user', 'name email role')
            .populate('products.product', 'name price category');

        res.status(200).json({
            success: true,
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
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email role')
            .populate('products.product', 'name price category');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Ensure a normal 'user' can only view their own order
        if (req.user.role === 'user' && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You can only view your own orders"
            });
        }

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