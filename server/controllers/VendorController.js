let vendorModel = require("../models/Vendor.Model");
let cloudinary = require("../utils/CloudinaryImage");

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

      // Validate required text fields
      if (
        !storeName ||
        !storeDescription ||
        !phoneNumber ||
        !CNIC ||
        !address ||
        !city ||
        !postalCode ||
        !accountNumber ||
        !country
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate required files (4 fields)
      if (
        !req.files ||
        !req.files.storeLogo ||
        !req.files.cnicFrontImage ||
        !req.files.cnicBackImage ||
        !req.files.transactionImage
      ) {
        return res.status(400).json({
          message:
            "All images are required (storeLogo, cnicFrontImage, cnicBackImage, transactionImage)",
        });
      }

      // Upload images to Cloudinary
      const storeLogoUrl = await uploadToCloudinary(
        req.files.storeLogo[0].buffer,
        "e-commerce/vendor-logos"
      );

      const cnicFrontImageUrl = await uploadToCloudinary(
        req.files.cnicFrontImage[0].buffer,
        "e-commerce/vendor-cnic"
      );

      const cnicBackImageUrl = await uploadToCloudinary(
        req.files.cnicBackImage[0].buffer,
        "e-commerce/vendor-cnic"
      );

      const transactionImageUrl = await uploadToCloudinary(
        req.files.transactionImage[0].buffer,
        "e-commerce/vendor-transaction"
      );

      // Create Vendor
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
      });

      return res
        .status(201)
        .json({ message: "Vendor created successfully", vendor });
    } catch (error) {
      console.error("Error in becoming vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // READ - all
  async getVendors(req, res) {
    try {
      const vendors = await vendorModel.find();
      return res
        .status(200)
        .json({ vendors, message: "Vendors fetched successfully" });
    } catch (error) {
      console.error("Error in getting vendors:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // READ - by id
  async getVendorById(req, res) {
    try {
      const vendorId = req.params.id;
      const vendor = await vendorModel
        .findById(vendorId)
        .populate("user", "name email");
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      return res
        .status(200)
        .json({ vendor, message: "Vendor fetched successfully" });
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

      // Keep same "all required" logic as your previous version
      if (
        !updates.storeName ||
        !updates.storeDescription ||
        !updates.phoneNumber ||
        !updates.CNIC ||
        !updates.address ||
        !updates.city ||
        !updates.postalCode ||
        !updates.accountNumber ||
        !updates.country
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Cast numeric fields (if provided as strings)
      updates.phoneNumber = Number(updates.phoneNumber);
      updates.CNIC = Number(updates.CNIC);
      updates.postalCode = Number(updates.postalCode);

      // If files provided, upload and set new URLs
      if (req.files) {
        if (req.files.storeLogo?.[0]) {
          updates.storeLogo = await uploadToCloudinary(
            req.files.storeLogo[0].buffer,
            "e-commerce/vendor-logos"
          );
        }
        if (req.files.cnicFrontImage?.[0]) {
          updates.cnicFrontImage = await uploadToCloudinary(
            req.files.cnicFrontImage[0].buffer,
            "e-commerce/vendor-cnic"
          );
        }
        if (req.files.cnicBackImage?.[0]) {
          updates.cnicBackImage = await uploadToCloudinary(
            req.files.cnicBackImage[0].buffer,
            "e-commerce/vendor-cnic"
          );
        }
        if (req.files.transactionImage?.[0]) {
          updates.transactionImage = await uploadToCloudinary(
            req.files.transactionImage[0].buffer,
            "e-commerce/vendor-transaction"
          );
        }
      }

      const updatedVendor = await vendorModel.findByIdAndUpdate(
        vendorId,
        updates,
        { new: true }
      );

      if (!updatedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      return res.status(200).json({
        updatedVendor,
        message: "Vendor updated successfully",
      });
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
      if (!deletedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      return res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
      console.error("Error in deleting vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // VERIFY
  async verifyVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      vendor.isVerified = true;
      await vendor.save();
      return res
        .status(200)
        .json({ message: "Vendor verified successfully", vendor });
    } catch (error) {
      console.error("Error in verifying vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // BLOCK
  async blockVendor(req, res) {
    try {
      const vendorId = req.params.id;
      const vendor = await vendorModel.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      vendor.isBlocked = true;
      await vendor.save();
      return res
        .status(200)
        .json({ message: "Vendor blocked successfully", vendor });
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
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      vendor.isBlocked = false;
      await vendor.save();
      return res
        .status(200)
        .json({ message: "Vendor unblocked successfully", vendor });
    } catch (error) {
      console.error("Error in unblocking vendor:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PENDING (not verified)
  async pendingVendor(req, res) {
    try {
      const vendors = await vendorModel
        .find({ isVerified: false })
        .populate("user", "name email");
      return res.status(200).json({
        vendors,
        message: "Pending vendors fetched successfully",
      });
    } catch (error) {
      console.error("Error in fetching pending vendors:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new VendorController();
