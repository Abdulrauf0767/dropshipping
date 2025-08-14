const BuynowformeModel = require('../models/BuyNowForMe.Model');
const UserModel = require('../models/User.Model');
const ProductModel = require('../models/Product.Model');
const NotificationModel = require('../models/Notification.Model');

class BuyNowForMeController {
  // Create new order + notifications
  async createOrder(req, res) {
    try {
      const userId = req.user._id;
      const productId = req.body.productId;
      const {
        userName,
        email,
        phone,
        price,
        address,
        city,
        country,
        province,
        postalCode,
        productColor,
        productSize,
        quantity,
        paymentMethod,
        deliveryCharge,
        total,
      } = req.body;

      // Validation
      if (
        !userName ||
        !email ||
        !phone ||
        !price ||
        !address ||
        !city ||
        !country ||
        !province ||
        !postalCode ||
        !productColor ||
        !quantity ||
        !paymentMethod ||
        !deliveryCharge ||
        !total ||
        !productId
      ) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (paymentMethod !== 'cashondelivery') {
        return res.status(400).json({ message: 'Invalid payment method' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Create order with one product in products array (as per schema)
      const order = await BuynowformeModel.create({
        user: user._id,
        products: [product._id],
        userName,
        email,
        phone,
        price,
        address,
        city,
        country,
        province,
        postalCode,
        productColor,
        productSize,
        quantity,
        paymentMethod,
        deliveryCharge,
        total,
        orderStatus: 'pending',
        paymentStatus: 'pending',
      });

         const userNotification = await NotificationModel.create({
        user: user._id,
        product: product._id,
        message: `Your order for "${product.name}" has been placed successfully.`,
        notificationType: 'order',
        isRead: false,
        link: `/home/productdetail/${product._id}`,
        });

        // Admin users nikal lo DB se
        const adminUsers = await UserModel.find({ role: 'admin' });

        for (const adminUser of adminUsers) {
        await NotificationModel.create({
            user: adminUser._id,
            product: product._id,
            message: `New order for "${product.name}" has been placed by ${user.name}.`,
            notificationType: 'order',
            isRead: false,
            link: `/admin/orders`,
        });
        }

      return res.status(201).json({
        message: 'Order and notifications created successfully',
        order,
        userNotification,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // Get orders for logged-in user
  async getOrders(req, res) {
    try {
      const userId = req.user._id;
      const orders = await BuynowformeModel.find({ user: userId }).populate('products', 'name price image');
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Orders not found' });
      }
      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error getting orders:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // Get single order by ID
  async getOrderById(req, res) {
    try {
      const orderId = req.params.id;
      const order = await BuynowformeModel.findById(orderId).populate('products', 'name price image');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json(order);
    } catch (error) {
      console.error('Error getting order by ID:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // Delete order by ID
  async deleteOrder(req, res) {
    try {
      const orderId = req.params.id;
      const order = await BuynowformeModel.findByIdAndDelete(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json({ message: 'Order deleted successfully', order });
    } catch (error) {
      console.error('Error deleting order:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // Update order details (excluding user and products)
  async updateOrder(req, res) {
    try {
      const orderId = req.params.id;
      const updateData = { ...req.body };
      delete updateData.user;
      delete updateData.products;

      const updatedOrder = await BuynowformeModel.findByIdAndUpdate(orderId, updateData, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // Get all orders (admin)
  async getAllOrders(req, res) {
    try {
      const orders = await BuynowformeModel.find({})
        .populate('products', 'name price image')
        .populate('user', 'name email');
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Orders not found' });
      }
      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error getting all orders:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // Update orderStatus only
  async updateOrderStatus(req, res) {
    try {
      const orderId = req.params.id;
      const { orderStatus } = req.body;
      if (!orderStatus) {
        return res.status(400).json({ message: 'orderStatus is required' });
      }
      const updatedOrder = await BuynowformeModel.findByIdAndUpdate(orderId, { orderStatus }, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }

  // Update paymentStatus only
  async updatePaymentStatus(req, res) {
    try {
      const orderId = req.params.id;
      const { paymentStatus } = req.body;
      if (!paymentStatus) {
        return res.status(400).json({ message: 'paymentStatus is required' });
      }
      const updatedOrder = await BuynowformeModel.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json({ message: 'Payment status updated successfully', order: updatedOrder });
    } catch (error) {
      console.error('Error updating payment status:', error);
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }
}

module.exports = new BuyNowForMeController();
