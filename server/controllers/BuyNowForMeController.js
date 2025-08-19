const BuynowformeModel = require('../models/BuyNowForMe.Model');
const UserModel = require('../models/User.Model');
const ProductModel = require('../models/Product.Model');
const NotificationModel = require('../models/Notification.Model');
const mongoose = require('mongoose');

class BuyNowForMeController {

  // ================= CREATE ORDER FOR SELF =================
  async createOrder(req, res) {
    try {
      const userId = req.user._id;
      const {
        productId, userName, email, phone, price, address, city,
        country, province, postalCode, productColor, productSize,
        quantity, paymentMethod, deliveryCharge, total
      } = req.body;

      // Validation
      if (!productId || !userName || !email || !phone || !price || !address || !city ||
          !country || !province || !postalCode || !productColor || !quantity ||
          !paymentMethod || !deliveryCharge || !total) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (paymentMethod !== 'cashondelivery') {
        return res.status(400).json({ message: 'Invalid payment method' });
      }

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const product = await ProductModel.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      // Create order with vendor from product
      const order = await BuynowformeModel.create({
        user: user._id,
        vendor: product.userId, // vendor field automatically set
        products: [product._id],
        userName, email, phone, price, address, city,
        country, province, postalCode, productColor, productSize,
        quantity, paymentMethod, deliveryCharge, total,
        orderStatus: 'pending',
        paymentStatus: 'pending',
      });

      // User notification
      await NotificationModel.create({
        user: user._id,
        product: product._id,
        message: `Your order for "${product.name}" has been placed successfully.`,
        notificationType: 'order',
        isRead: false,
        link: `/home/productdetail/${product._id}`,
      });

      // Admin notifications
      const adminUsers = await UserModel.find({ role: 'admin' });
      const adminNotifications = adminUsers.map(admin => ({
        user: admin._id,
        product: product._id,
        message: `New order for "${product.name}" has been placed by ${user.name}.`,
        notificationType: 'order',
        isRead: false,
        link: `/admin/orders`,
      }));
      if (adminNotifications.length) await NotificationModel.insertMany(adminNotifications);

      return res.status(201).json({ message: 'Order created successfully', order });

    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // ================= CREATE ORDER FOR SOMEONE =================
  async createOrderSomeone(req, res) {
    try {
      const userId = req.user._id;
      const {
        productId, userName, marginPrice, email, phone, price, address, city,
        country, province, postalCode, productColor, productSize,
        quantity, paymentMethod, deliveryCharge, total
      } = req.body;

      // Validation
      if (!productId || !userName || !marginPrice || !email || !phone || !price ||
          !address || !city || !country || !province || !postalCode || !productColor ||
          !quantity || !paymentMethod || !deliveryCharge || !total) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (paymentMethod !== 'cashondelivery') {
        return res.status(400).json({ message: 'Invalid payment method' });
      }

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const product = await ProductModel.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      // Create order with vendor from product
      const order = await BuynowformeModel.create({
        user: user._id,
        vendor: product.userId,
        products: [product._id],
        userName, marginPrice, email, phone, price, address, city,
        country, province, postalCode, productColor, productSize,
        quantity, paymentMethod, deliveryCharge, total,
        orderStatus: 'pending',
        paymentStatus: 'pending',
      });

      // User notification
      await NotificationModel.create({
        user: user._id,
        product: product._id,
        message: `Your order for "${product.name}" has been placed successfully.`,
        notificationType: 'order',
        isRead: false,
        link: `/home/productdetail/${product._id}`,
      });

      // Admin notifications
      const adminUsers = await UserModel.find({ role: 'admin' });
      const adminNotifications = adminUsers.map(admin => ({
        user: admin._id,
        product: product._id,
        message: `New order for "${product.name}" has been placed by ${user.name}.`,
        notificationType: 'order',
        isRead: false,
        link: `/admin/orders`,
      }));
      if (adminNotifications.length) await NotificationModel.insertMany(adminNotifications);

      return res.status(201).json({ message: 'Order created successfully', order });

    } catch (error) {
      console.error('Error creating order for someone:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // ================= GET ORDERS FOR LOGGED IN USER =================
  async getOrders(req, res) {
      try {
    const userId = req.user._id;

    // Login user ke liye un orders ko fetch karna jahan wo vendor hai
    const orders = await BuynowformeModel.find({ vendor: userId })
      .populate('products', 'name price image description ')
      .populate('vendor', 'name email')
      .populate('user', 'name email') // order kisne kiya hai
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
  } 

  // ================= GET ALL ORDERS (ADMIN) =================
  async getAllOrders(req, res) {
    try {
      const orders = await BuynowformeModel.find({})
        .populate('products', 'name price image')
        .populate('user', 'name email')
        .populate('vendor', 'name email')
        .sort({ createdAt: -1 });

      return res.status(200).json({ orders: orders || [] });
    } catch (error) {
      console.error('Error getting all orders:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // ================= DELETE ORDER =================
  async deleteOrder(req, res) {
    try {
      const orderId = req.params.id;
      const order = await BuynowformeModel.findByIdAndDelete(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json({ message: 'Order deleted successfully', order });
    } catch (error) {
      console.error('Error deleting order:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // ================= UPDATE ORDER STATUS =================
  async updateOrderStatus(req, res) {
    try {
      const { id: orderId } = req.params;
      const { status: orderStatus } = req.body;

      if (!orderStatus) return res.status(400).json({ message: 'orderStatus is required' });

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(orderStatus)) return res.status(400).json({ message: 'Invalid order status' });

      const order = await BuynowformeModel.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      const wasDelivered = order.orderStatus === 'delivered';
      order.orderStatus = orderStatus;
      await order.save();

      // Reduce product stock on delivery
      if (orderStatus === 'delivered' && !wasDelivered) {
        for (const item of order.products) {
          const product = await ProductModel.findById(item);
          if (product) {
            product.stock = Math.max(product.stock - (item.quantity || 1), 0);
            await product.save();
          }
        }
      }

      return res.status(200).json({ message: 'Order status updated successfully', order });

    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }
}

module.exports = new BuyNowForMeController();
