// @desc    Authorize roles (RBAC Middleware)
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access denied for role '${req.user ? req.user.role : 'unknown'}'`
            });
        }

        next();
    };
};

module.exports = { authorizeRoles };