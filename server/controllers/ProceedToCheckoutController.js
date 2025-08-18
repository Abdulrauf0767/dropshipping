let ProceedTocheckoutModel = require('../models/ProceedTocheckout.Model');
let ProductModel = require('../models/Product.Model');
let UserModel = require('../models/User.Model');

class ProceedTocheckoutController {
    
    // ORDER FOR YOU
    async orderForYou(req, res) {
        try {
            let { products, price, address, city, country, province, phone } = req.body;

            let user = await UserModel.findById(req.user._id);
            if (!user) return res.status(404).json({ message: "User not found" });

            let validatedProducts = [];
            for (let item of products) {
                let product = await ProductModel.findById(item.product);
                if (!product) return res.status(404).json({ message: "Product not found" });

                validatedProducts.push({
                    product: product._id,
                    quantity: item.quantity,
                    priceAtPurchase: product.price,
                    vendor: product.userId   // ✅ Product ka owner (vendor/admin)
                });
            }

            let order = new ProceedTocheckoutModel({
                user: user._id,
                products: validatedProducts,
                userName: user.name,
                email: user.email,
                phone,
                price,
                address,
                city,
                country,
                province
            });

            await order.save();
            res.status(201).json({ message: "Order placed successfully (for you)", order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    // ORDER FOR SOMEONE
    async orderForSomeone(req, res) {
        try {
            let { products, price, marginPrice, address, city, country, province, phone, userName, email } = req.body;

            let user = await UserModel.findById(req.user._id);
            if (!user) return res.status(404).json({ message: "User not found" });

            let validatedProducts = [];
            for (let item of products) {
                let product = await ProductModel.findById(item.product);
                if (!product) return res.status(404).json({ message: "Product not found" });

                validatedProducts.push({
                    product: product._id,
                    quantity: item.quantity,
                    priceAtPurchase: product.price,
                    vendor: product.userId  // ✅ Vendor/Admin
                });
            }

            let order = new ProceedTocheckoutModel({
                user: user._id,
                products: validatedProducts,
                userName,
                email,
                phone,
                marginPrice,
                price,
                address,
                city,
                country,
                province
            });

            await order.save();
            res.status(201).json({ message: "Order placed successfully (for someone)", order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    // GET USER ORDERS
    async getMyOrders(req, res) {
        try {
            let orders = await ProceedTocheckoutModel.find({ user: req.user._id })
                .populate("products.product")
                .populate("products.vendor", "name email role") // ✅ vendor details
                .sort({ createdAt: -1 });

            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    // GET ALL ORDERS
    async getAllOrders(req, res) {
        try {
            let orders = await ProceedTocheckoutModel.find()
                .populate("user", "name email")
                .populate("products.product")
                .populate("products.vendor", "name email role") // ✅
                .sort({ createdAt: -1 });

            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    // UPDATE ORDER STATUS
    async updateOrderStatus(req, res) {
        try {
            let { orderId } = req.params;
            let { status } = req.body;

            let order = await ProceedTocheckoutModel.findById(orderId);
            if (!order) return res.status(404).json({ message: "Order not found" });

            order.orderStatus = status;
            await order.save();

            res.status(200).json({ message: `Order status updated to ${status}`, order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    // REJECT ORDER
    async rejectOrder(req, res) {
        try {
            let { orderId } = req.params;
            let order = await ProceedTocheckoutModel.findById(orderId);

            if (!order) return res.status(404).json({ message: "Order not found" });

            await order.deleteOne();
            res.status(200).json({ message: "Order rejected/cancelled successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
}

module.exports = new ProceedTocheckoutController();
