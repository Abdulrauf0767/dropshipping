let isVendor = (req, res, next) => {
    if (req.user && req.user.role === 'vendor') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. You are not a vendor." });
    }
}
module.exports = isVendor;