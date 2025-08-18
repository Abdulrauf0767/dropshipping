const mongoose = require("mongoose");

const proceedTocheckoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // order place karne wala user
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // 👈 product kisne banaya (vendor ya admin)
          required: true,
        },
      },
    ],
    userName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
    marginPrice: { type: Number }, // for dropshipping orders
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProceedToCheckout", proceedTocheckoutSchema);
