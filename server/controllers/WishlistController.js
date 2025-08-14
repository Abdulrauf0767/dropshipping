let WishlistModel = require('../models/Wishlist.Model');
let ProductModel = require('../models/Product.Model');

class WishlistController {
    // ✅ Add product to wishlist
    async addProduct(req, res) {
        try {
            let userId = req.user._id;
            let productId = req.params.id;

            // Find or create wishlist
            let wishlist = await WishlistModel.findOne({ user: userId });
            if (!wishlist) {
                wishlist = await WishlistModel.create({ user: userId, products: [] });
            }

            // Check if product exists
            let product = await ProductModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Avoid duplicates
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            // Add product
            wishlist.products.push(productId);
            await wishlist.save();

            res.status(200).json({ message: 'Product added to wishlist successfully', wishlist });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }

    // ❌ Remove product from wishlist
    async removeProduct(req, res) {
        try {
            let userId = req.user._id;
            let productId = req.params.id;

            let wishlist = await WishlistModel.findOne({ user: userId });
            if (!wishlist) {
                return res.status(404).json({ message: 'Wishlist not found' });
            }

            // Remove product
            wishlist.products = wishlist.products.filter(
                (p) => p.toString() !== productId
            );

            await wishlist.save();

            res.status(200).json({ message: 'Product removed from wishlist successfully', wishlist });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }

    // 📜 Get user's wishlist
    async getWishlist(req, res) {
        try {
            let userId = req.user._id;
            let wishlist = await WishlistModel.findOne({ user: userId }).populate('products');
            if (!wishlist) {
                return res.status(404).json({ message: 'Wishlist not found' });
            }

            res.status(200).json(wishlist);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

module.exports = new WishlistController();
