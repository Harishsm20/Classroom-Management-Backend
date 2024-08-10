const jwt = require('jsonwebtoken');

module.exports = {
    auth: (req, res, next) => {
        const token = req.header('x-auth-token');
        console.log(`token : ${token}`);
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            console.log(`User : ${req.user.role}`);
            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    },
    authorize: (role) => (req, res, next) => {
        if (req.user.role !== role) return res.status(403).json({ msg: 'Access denied' });
        next();
    }
};
