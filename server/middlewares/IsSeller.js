let IsSeller = (req,res,next) => {
    try {
        if (req.user && req.user.role === 'seller') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Seller role required' });
            
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = IsSeller