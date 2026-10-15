const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Read the Authorization header & check if it starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extract the Bearer token (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the JWT
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'fallback_secret_key'
            );

            // 4 & 5. Identify the user and attach user information to req (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized, user not found"
                });
            }

            // 6. Call next() to pass control to the route controller
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, invalid or expired token"
            });
        }
    }

    // If no token is found in the header
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided"
        });
    }
};

module.exports = { protect };