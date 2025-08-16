let express = require('express');
let vendorRoutes = express.Router();
let VendorController = require('../controllers/VendorController');
let verifyToken = require('../middlewares/VerifyToken');
let apikeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let vendorValidation = require('../validators/VendorValidator');
let validateRequest = require('../middlewares/ValidateRequest');
let isBlocked = require('../middlewares/IsBlocked');
let isVendor = require('../middlewares/IsVendor');
let isAdmin = require('../middlewares/IsAdmin');
let VendorUpload = require('../utils/VendorUpload');

// Route to become a vendor
vendorRoutes.post(
  '/become-vendor',
  apikeyMiddleware,
  verifyToken,
  isBlocked,
  VendorUpload.fields([
    { name: 'storeLogo', maxCount: 1 },
    { name: 'cnicFrontImage', maxCount: 1 },
    { name: 'cnicBackImage', maxCount: 1 },
    { name: 'transactionImage', maxCount: 1 }
  ]),
  vendorValidation,
  validateRequest,
  VendorController.becomeVendor
);

// Route to get all vendors
vendorRoutes.get(
  '/all-vendors',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.getVendors
);

// Route to get a specific vendor by ID
vendorRoutes.get(
  '/vendor/:id',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.getVendorById
);

// Route to update vendor details
vendorRoutes.patch(
  '/update-vendor/:id',
  apikeyMiddleware,
  verifyToken,
  isVendor,
  VendorUpload.fields([
    { name: 'storeLogo', maxCount: 1 },
    { name: 'cnicFrontImage', maxCount: 1 },
    { name: 'cnicBackImage', maxCount: 1 },
    { name: 'transactionImage', maxCount: 1 }
  ]),
  vendorValidation,
  validateRequest,
  VendorController.updateVendor
);

// Route to delete a vendor
vendorRoutes.delete(
  '/delete-vendor/:id',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.deleteVendor
);

// Route to verify vendor
vendorRoutes.patch(
  '/verify-vendor/:id',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.verifyVendor
);

// Route to block vendor
vendorRoutes.patch(
  '/block-vendor/:id',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.blockVendor
);

// Route to unblock vendor
vendorRoutes.patch(
  '/unblock-vendor/:id',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.unBlockVendor
);

// Route to get all pending vendors
vendorRoutes.get(
  '/pending-vendors',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.pendingVendor
);

// Route to reject vendor
vendorRoutes.patch(
  '/reject-vendor/:id',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.rejectVendor
);

// search vendors
vendorRoutes.get(
  '/search-vendors',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.searchVendors
);
// all blocked users
vendorRoutes.get(
  '/all-blocked-vendors',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.getAllBlockedVendors
);
// all rejected users
vendorRoutes.get(
  '/all-rejected-vendors',
  apikeyMiddleware,
  verifyToken,
  isAdmin,
  VendorController.getallRejectedVendors
);

module.exports = vendorRoutes;
