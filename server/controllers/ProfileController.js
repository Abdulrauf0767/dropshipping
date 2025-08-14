const bcrypt = require("bcrypt");
const UserModel = require("../models/User.Model");
const cloudinary = require("../utils/CloudinaryImage"); // tumne jo cloudinary export kiya hai

class ProfileController {
  /**
   * Update User Profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const updates = {};

      // ✅ Allowed fields to update
      const allowedFields = [
        "name",
        "email",
        "bio",
        "phone",
        "address",
        "gender",
        "age",
        "password"
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined && req.body[field] !== "") {
          updates[field] = req.body[field];
        }
      });

      // ✅ If password is present, hash it
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }

      // ✅ If file is present → upload to Cloudinary
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "avatars", resource_type: "image" },
              (error, uploadResult) => {
                if (error) reject(error);
                else resolve(uploadResult);
              }
            )
            .end(req.file.buffer);
        });
        updates.avatar = result.secure_url;
      }

      // ✅ Update user
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user._id;

      // ✅ Fetch user profile without password
      const user = await UserModel.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = new ProfileController();
