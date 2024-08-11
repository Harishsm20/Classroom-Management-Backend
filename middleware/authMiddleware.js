const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
    auth: async (req, res, next) => {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.user.id).select('-password');
            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    },
    authorize: (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ msg: 'Permission denied' });
            }
            next();
        };
    }
};
