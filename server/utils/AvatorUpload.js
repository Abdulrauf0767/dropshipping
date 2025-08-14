const multer = require("multer");

function AvatarUpload(maxFileSizeMB = 2) {
  const storage = multer.memoryStorage();

  return multer({
    storage,
    limits: {
      fileSize: maxFileSizeMB * 1024 * 1024, // MB → Bytes
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"), false);
      }
      cb(null, true);
    },
  }).single("avatar"); // field name "avatar"
}

module.exports = AvatarUpload;
