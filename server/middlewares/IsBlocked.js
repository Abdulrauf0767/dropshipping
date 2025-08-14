// middlewares/isBlocked.js
const User = require("../models/User.Model");

const isBlocked = async (req, res, next) => {
    try {
        const userId = req.user._id; // JWT auth se aayega

        const user = await User.findById(userId).select("isBlocked");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is blocked. Contact support." });
        }

        next();
    } catch (error) {
        console.error("isBlocked middleware error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = isBlocked;
