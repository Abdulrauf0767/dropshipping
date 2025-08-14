let express = require("express");
let ProfileRoutes = express.Router();

const ProfileController = require("../controllers/ProfileController");
const ApiKeyMiddleware = require("../middlewares/ApiKeyMiddleware");
const verifyToken = require("../middlewares/VerifyToken");
const IsBlocked = require("../middlewares/IsBlocked");
const AvatarUpload = require("../utils/AvatorUpload"); // ✅ Spelling fix

// PATCH → partial update
ProfileRoutes.patch(
  "/update",
  ApiKeyMiddleware,
  verifyToken,
  IsBlocked,
  AvatarUpload(2), // ✅ Multer middleware for avatar upload (2MB default)
  ProfileController.updateProfile
);

ProfileRoutes.get(
  "/get",
  ApiKeyMiddleware,
  verifyToken,
  IsBlocked,
  ProfileController.getProfile
);

module.exports = ProfileRoutes;
