const WithdrawModel = require('../models/WithDraw.Model');
const UserModel = require('../models/User.Model');
const axios = require('axios');
const BuyNowForMeModel = require('../models/BuyNowForMe.Model');
const ProceedTocheckoutModel = require('../models/ProceedTocheckout.Model');
let mongoose = require('mongoose');
const BuyNowForMeController = require('./BuyNowForMeController');
require('dotenv').config();

class WithdrawController {
    // 1️⃣ Create withdraw request
    async createWithdraw(req, res) {
        try {
            const user = req.user?._id;
            const { bankNumber, bankName, bankType, amount } = req.body;

            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            if (!amount || amount <= 0) {
                return res.status(400).json({ message: "Invalid withdraw amount" });
            }

            const withdraw = await WithdrawModel.create({
                user,
                bankNumber,
                bankName,
                bankType,
                amount,
                status: "pending"
            });

            return res.status(200).json(withdraw);

        } catch (error) {
            console.error("CreateWithdraw Error:", error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    // 2️⃣ Get all pending withdraws
   async pendingWithdraws(req, res) {
     try {
      // Find all pending withdraws and populate user
      const withdraws = await WithdrawModel.find({ status: "pending" }).populate("user");

      // Loop through withdraws and calculate balance for each user
      const withdrawsWithBalance = await Promise.all(
        withdraws.map(async (withdraw) => {
          const sellerId = withdraw.user._id;

          // BuyNowForMe aggregation
          const buyNowMargin = await BuyNowForMeModel.aggregate([
            {
              $match: {
                user: new mongoose.Types.ObjectId(sellerId),
                orderStatus: "delivered",
              },
            },
            { $unwind: "$products" },
            {
              $group: {
                _id: null,
                totalMargin: { $sum: "$marginPrice" },
              },
            },
          ]);

          // ProceedToCheckout aggregation
          const proceedMargin = await ProceedTocheckoutModel.aggregate([
            {
              $match: {
                user: new mongoose.Types.ObjectId(sellerId),
                orderStatus: "delivered",
              },
            },
            { $unwind: "$products" },
            {
              $group: {
                _id: null,
                totalMargin: { $sum: "$marginPrice" },
              },
            },
          ]);

          const totalBuyNow = buyNowMargin[0]?.totalMargin || 0;
          const totalProceed = proceedMargin[0]?.totalMargin || 0;

          const previousBalance = totalBuyNow + totalProceed;

          return {
            ...withdraw.toObject(),
            previousBalance,
          };
        })
      );

      return res.status(200).json({
        message: "Pending withdraws with balances fetched successfully",
        data: withdrawsWithBalance,
      });
    } catch (error) {
      console.error("PendingWithdraws Error:", error);
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  }


    // 3️⃣ Approve withdraw
async approveWithdraw(req, res) {
   try {
    const { id } = req.params; // Withdraw request ka _id

    console.log("👉 Approve Withdraw called with ID:", id);

    // Withdraw request find karo by _id
    const withdraw = await WithdrawModel.findOne({user: id, status: "pending"});
    if (!withdraw) {
      return res.status(404).json({ message: "Withdraw request not found" });
    }
    console.log("👉 Withdraw found:", withdraw);

    if (withdraw.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request is already processed" });
    }

    // User fetch karo
    const user = await UserModel.findById(withdraw.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("👉 User found:", user);

    // Withdraw approve karo
    withdraw.status = "approved";
    await withdraw.save();

    // Optional: User balance update karo (agar tum future withdrawal check karna chahte ho)
    user.balance = (user.balance || 0) - withdraw.amount;
    if (user.balance < 0) user.balance = 0;
    await user.save();

    res.status(200).json({
      message: "Withdraw approved successfully",
      withdraw,
    });

  } catch (error) {
    console.error("Approve withdraw error:", error);
    res.status(500).json({ message: "Server error" });
  }
  }





// ✅ Reject Withdraw
async rejectedWithdraw(req, res) {
  try {
    const userId = req.params.id;

    // Sirf pending ko reject karna
    const withdraw = await WithdrawModel.findOne({ user: userId, status: "pending" });

    if (!withdraw) {
      return res.status(404).json({ message: "Pending withdraw not found" });
    }

    withdraw.status = "rejected";
    await withdraw.save();

    return res.status(200).json({
      message: "Withdraw rejected",
      withdraw
    });

  } catch (error) {
    console.error("RejectedWithdraw Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
} 
}


module.exports = new WithdrawController();
