// middlewares/ProductUpload.js
const multer = require('multer');

function ProductUpload(fieldName, maxFileSizeMB, maxCount) {
    const storage = multer.memoryStorage();

    return multer({
        storage,
        limits: {
            fileSize: maxFileSizeMB * 1024 * 1024 // max size per file in MB
        }
    }).array(fieldName, maxCount); // multiple files
}

module.exports = ProductUpload;
