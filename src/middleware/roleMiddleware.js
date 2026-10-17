// @desc    Authorize roles (RBAC Middleware)
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Ensure req.user exists and their role is in the allowedRoles list
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access denied for role '${req.user ? req.user.role : 'unknown'}'`
            });
        }

        // User has the required role -> proceed to controller
        next();
    };
};

module.exports = { authorizeRoles };