const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Any authenticated user)
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

        // 2. Calculate totalAmount from DB if not explicitly provided
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

// @desc    Get orders (Manager/Admin -> All orders | User/Others -> Own orders)
// @route   GET /api/orders
// @access  Private (Any authenticated user)
const getOrders = async (req, res) => {
    try {
        let filter = {};

        // Manager and Admin can view all orders; regular users (including 'user' or 'Team_lead') only view their own orders
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
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email role')
            .populate('products.product', 'name price category');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Ensure regular users can only view their own order
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