const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token and strip any accidental quotes or extra spaces
            token = req.headers.authorization.split(' ')[1].replace(/"/g, '').trim();

            // Verify token using the exact same fallback secret as authController
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'fallback_secret_key'
            );

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized, user not found in database"
                });
            }

            return next();
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            return res.status(401).json({
                success: false,
                message: "Not authorized, invalid or expired token",
                reason: error.message // Shows the exact reason right in Postman!
            });
        }
    }

    return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided"
    });
};

module.exports = { protect };