require('dotenv').config();

const IsAdminOrVendor = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'vendor') {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
};

module.exports = IsAdminOrVendor;