const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided"
        });
    }

    try {
        const token = authHeader
            .replace(/^Bearer\s+/i, '')
            .replace(/^Bearer\s+/i, '')
            .replace(/["']/g, '')
            .trim();

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'fallback_secret_key'
        );

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, user not found"
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, invalid or expired token",
            reason: error.message
        });
    }
};

module.exports = { protect };