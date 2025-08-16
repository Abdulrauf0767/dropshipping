let vendorModel = require("../models/Vendor.Model");
let cloudinary = require("../utils/CloudinaryImage");
let UserModel = require("../models/User.Model");

const uploadToCloudinary = (fileBuffer, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      })
      .end(fileBuffer);
  });

class VendorController {
  // CREATE
  async becomeVendor(req, res) {
    try {
      const user = req.user._id;
      let {
        storeName,
        storeDescription,
        phoneNumber,
        CNIC,
        address,
        city,
        postalCode,
        accountNumber,
        country,
        websiteURL,
      } = req.body;

      if (!storeName || !storeDescription || !phoneNumber || !CNIC || !address || 
          !city || !postalCode || !accountNumber || !country) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!req.files || !req.files.storeLogo || !req.files.cnicFrontImage || 
          !req.files.cnicBackImage || !req.files.transactionImage) {
        return res.status(400).json({
          message: "All images are required (storeLogo, cnicFrontImage, cnicBackImage, transactionImage)",
        });
      }

      // Upload images
      const storeLogoUrl = await uploadToCloudinary(req.files.storeLogo[0].buffer, "e-commerce/vendor-logos");
      const cnicFrontImageUrl = await uploadToCloudinary(req.files.cnicFrontImage[0].buffer, "e-commerce/vendor-cnic");
      const cnicBackImageUrl = await uploadToCloudinary(req.files.cnicBackImage[0].buffer, "e-commerce/vendor-cnic");
      const transactionImageUrl = await uploadToCloudinary(req.files.transactionImage[0].buffer, "e-commerce/vendor-transaction");

      // Create Vendor with status = pending
      const vendor = await vendorModel.create({
        user,
        storeLogo: storeLogoUrl,
        storeName,
        storeDescription,
        phoneNumber: Number(phoneNumber),
        CNIC: Number(CNIC),
        cnicFrontImage: cnicFrontImageUrl,
        cnicBackImage: cnicBackImageUrl,
        address,
        city,
        transactionImage: transactionImageUrl,
        postalCode: Number(postalCode),
        accountNumber,
        country,
        websiteURL,
        status: "pending",
        isVerified: false
      });

      return res.status(201).json({ message: "Vendor created successfully", vendor });
    } catch (error) {
      console.error("Error in becoming vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // READ all
  async getVendors(req, res) {
    try {
      const vendors = await vendorModel.find({status : 'approved',isBlocked : false,isVerified : true}).populate("user", "name email");
      return res.status(200).json({ vendors, message: "Vendors fetched successfully" });
    } catch (error) {
      console.error("Error in getting vendors:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // READ by ID
  async getVendorById(req, res) {
    try {
      const vendorId = req.params.id;
      const vendor = await vendorModel.findById(vendorId).populate("user", "name email");
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
      return res.status(200).json({ vendor, message: "Vendor fetched successfully" });
    } catch (error) {
      console.error("Error in getting vendor by ID:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // UPDATE
  async updateVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const updates = { ...req.body };

      if (!updates.storeName || !updates.storeDescription || !updates.phoneNumber || 
          !updates.CNIC || !updates.address || !updates.city || !updates.postalCode || 
          !updates.accountNumber || !updates.country) {
        return res.status(400).json({ message: "All fields are required" });
      }

      updates.phoneNumber = Number(updates.phoneNumber);
      updates.CNIC = Number(updates.CNIC);
      updates.postalCode = Number(updates.postalCode);

      if (req.files) {
        if (req.files.storeLogo?.[0]) {
          updates.storeLogo = await uploadToCloudinary(req.files.storeLogo[0].buffer, "e-commerce/vendor-logos");
        }
        if (req.files.cnicFrontImage?.[0]) {
          updates.cnicFrontImage = await uploadToCloudinary(req.files.cnicFrontImage[0].buffer, "e-commerce/vendor-cnic");
        }
        if (req.files.cnicBackImage?.[0]) {
          updates.cnicBackImage = await uploadToCloudinary(req.files.cnicBackImage[0].buffer, "e-commerce/vendor-cnic");
        }
        if (req.files.transactionImage?.[0]) {
          updates.transactionImage = await uploadToCloudinary(req.files.transactionImage[0].buffer, "e-commerce/vendor-transaction");
        }
      }

      const updatedVendor = await vendorModel.findByIdAndUpdate(vendorId, updates, { new: true });
      if (!updatedVendor) return res.status(404).json({ message: "Vendor not found" });

      return res.status(200).json({ updatedVendor, message: "Vendor updated successfully" });
    } catch (error) {
      console.error("Error in updating vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE
  async deleteVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const deletedVendor = await vendorModel.findByIdAndDelete(vendorId);
      if (!deletedVendor) return res.status(404).json({ message: "Vendor not found" });
      return res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
      console.error("Error in deleting vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // APPROVE Vendor
  async verifyVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
      const userRole = await UserModel.findByIdAndUpdate(vendor.user._id, { role: "vendor" });
      vendor.isVerified = true;
      vendor.status = "approved";
      await vendor.save();


      return res.status(200).json({ message: "Vendor approved successfully", vendor });
    } catch (error) {
      console.error("Error in verifying vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // REJECT Vendor
  async rejectVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });

      vendor.isVerified = false;
      vendor.status = "rejected";
      await vendor.save();

      return res.status(200).json({ message: "Vendor rejected successfully", vendor });
    } catch (error) {
      console.error("Error in rejecting vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getRejectedVendors (req, res) {
    try {
      const vendors = await vendorModel.find({ status: "rejected" }).populate("user", "name email");
      return res.status(200).json({ vendors, message: "Rejected vendors fetched successfully" });
    } catch (error) {
      console.error("Error in getting rejected vendors:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // BLOCK
  async blockVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });

      vendor.isBlocked = true;
      await vendor.save();
      return res.status(200).json({ message: "Vendor blocked successfully", vendor });
    } catch (error) {
      console.error("Error in blocking vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // UNBLOCK
  async unBlockVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });

      vendor.isBlocked = false;
      await vendor.save();
      return res.status(200).json({ message: "Vendor unblocked successfully", vendor });
    } catch (error) {
      console.error("Error in unblocking vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PENDING vendors
  async pendingVendor(req, res) {
    try {
      const vendors = await vendorModel.find({ status: "pending" }).populate("user", "name email");
      return res.status(200).json({ vendors, message: "Pending vendors fetched successfully" });
    } catch (error) {
      console.error("Error in fetching pending vendors:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async searchVendors(req, res) {
  try {
    let query = req.query.query || ""; // user se query
    let limit = parseInt(req.query.limit) || 50; // default limit 50 results

    // MongoDB regex search (case-insensitive)
    let result = await vendorModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },       // vendor name
        { storeName: { $regex: query, $options: "i" } },  // store name
      ]
    })
    .limit(limit)
    .populate("user", "name email"); // user details populate

    // agar result empty ho
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No vendors found" });
    }

    return res.status(200).json({
      message: "Vendors found",
      total: result.length,
      data: result
    });

  } catch (error) {
    console.error("Error in searching vendors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async getAllBlockedVendors (req,res) {
  try {
    let vendors = await vendorModel.find({isBlocked : true}).populate("user", "name email");
    return res.status(200).json({ vendors, message: "Blocked vendors fetched successfully" });
  } catch (error) {
    console.error("Error in getting all blocked vendors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async getallRejectedVendors (req,res) {
  try {
    let vendors = await vendorModel.find({status : "rejected"}).populate("user", "name email");
    return res.status(200).json({ vendors, message: "Rejected vendors fetched successfully" });
  } catch (error) {
    console.error("Error in getting all rejected vendors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

}

module.exports = new VendorController();
