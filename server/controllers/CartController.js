const CartModel = require('../models/Cart.Model');
const ProductModel = require('../models/Product.Model');
const mongoose = require('mongoose');
class CartController {
  // Add product to cart (if exists, increase quantity by 1)
  async addToCart(req, res) {
    try {
      const userId = req.user._id;
      const productId = req.params.id;

      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
      }

      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      let cart = await CartModel.findOne({ user: userId });
      if (!cart) {
        cart = await CartModel.create({ user: userId, products: [] });
      }

      // Check if product is already in cart
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex > -1) {
        // Increase quantity by 1 if product exists
        cart.products[productIndex].quantity += 1;
      } else {
        // Otherwise, add new product with quantity 1
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();

      // Populate product details before sending response
      await cart.populate('products.product');

      res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  // Get cart for logged-in user with populated product details
  async getCart(req, res) {
    try {
      const userId = req.user._id;

      const cart = await CartModel.findOne({ user: userId }).populate('products.product');

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  // Remove a product from the cart
  async removeFromCart(req, res) {
    try {
      const userId = req.user._id;
      const productId = req.params.id;

      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
      }

      const cart = await CartModel.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Filter out the product by comparing ObjectId strings
      cart.products = cart.products.filter(
        (p) => p.product.toString() !== productId
      );

      await cart.save();

      await cart.populate('products.product');

      res.status(200).json({ message: 'Product removed from cart successfully', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  // Update quantity of a product in the cart
  async updateQuantity(req, res) {
    try {
      const userId = req.user._id;
      const productId = req.params.id;
      const newQuantity = Number(req.body.quantity);

      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
      }

      if (!newQuantity || newQuantity < 1) {
        return res.status(400).json({ message: 'Quantity must be 1 or more' });
      }

      const cart = await CartModel.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not in cart' });
      }

      cart.products[productIndex].quantity = newQuantity;

      await cart.save();
      await cart.populate('products.product');

      res.status(200).json({ message: 'Quantity updated successfully', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

async getCartDatabyId(req, res) {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid cart ID" });
    }

    const cart = await CartModel.findById(id)
      .populate("products.product", "name price image userId") // ✅ nested populate
      .populate("user", "name email"); // ✅ also populate user

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res
      .status(200)
      .json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    console.error("Error in getCartDatabyId:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
}

module.exports = new CartController();
