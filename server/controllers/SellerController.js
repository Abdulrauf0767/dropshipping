let SellerModel = require('../models/Seller.Model');
const UserModel = require('../models/User.Model');

class SellerController {
  // Create a new seller
  async createSeller(req, res) {
    try {
      const { phoneNumber, bankNumber } = req.body;
      const userId = req.user._id;

      if (!phoneNumber || !bankNumber) {
        return res.status(400).json({ message: 'Phone number and bank number are required' });
      }

      // Check if seller already exists for this user
      const existingSeller = await SellerModel.findOne({ user: userId });
      if (existingSeller) {
        return res.status(400).json({ message: 'Seller profile already exists' });
      }

      // Create seller entry
      const newSeller = new SellerModel({
        user: userId, // reference to User model
        phoneNumber,
        bankNumber
      });
      await newSeller.save();

      // Update user role to "seller"
      await UserModel.findByIdAndUpdate(
        userId,
        { role: 'seller' },
        { new: true }
      );

      res.status(201).json({ 
        message: 'Seller created successfully and role updated to seller', 
        seller: newSeller 
      });

    } catch (error) {
      console.error('Error creating seller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get seller with populated user details
  async getSeller(req, res) {
    try {
      const userId = req.user._id;
      const seller = await SellerModel.findOne({ user: userId })
        .populate('user', 'name email role isBlocked');

      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }

      res.status(200).json(seller);
    } catch (error) {
      console.error('Error getting seller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Block seller by updating User model
  async blockSeller(req, res) {
    try {
      const sellerId = req.params.id;

      // Find the seller and populate the user
      const seller = await SellerModel.findById(sellerId).populate('user');
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }

      // Block the user account
      seller.user.isBlocked = true;
      await seller.user.save();

      res.status(200).json({ message: 'Seller blocked successfully', seller });
    } catch (error) {
      console.error('Error blocking seller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new SellerController();
