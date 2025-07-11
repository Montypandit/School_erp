const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Forbidden: User role not found in token.' });
        }

        const userRole = req.user.role;

        if (allowedRoles.includes(userRole)) {
            next(); 
        } else {
            return res.status(403).json({
                message: `Forbidden: Role '${userRole}' is not authorized to access this resource.`
            });
        }
    };
};

module.exports = authorizeRoles;
