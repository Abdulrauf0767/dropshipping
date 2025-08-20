// BuyNowForMeRoutes.js
const express = require('express');
const BuyNowForMeRoutes = express.Router();
const BuyNowForMeController = require('../controllers/BuyNowForMeController');
const verifyToken = require('../middlewares/VerifyToken');
const apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
const isBlocked = require('../middlewares/IsBlocked');
const BuyNowFormeValidator = require('../validators/BuyNowForMeValidator');
const validateRequest = require('../middlewares/ValidateRequest');
const isAdminOrVendor = require('../middlewares/IsAdminOrVendor');
let isAdmin = require('../middlewares/IsAdmin');

// ================= CREATE ORDER FOR SELF =================
BuyNowForMeRoutes.post(
  '/create-order',
  apiKeyMiddleware,
  verifyToken,
  isBlocked,
  BuyNowFormeValidator,
  validateRequest,
  BuyNowForMeController.createOrder
);

// ================= GET ORDERS FOR LOGGED-IN USER =================
BuyNowForMeRoutes.get(
  '/get-orders',
  apiKeyMiddleware,
  verifyToken,
  isBlocked,
  BuyNowForMeController.getOrders
);

// ================= GET ALL ORDERS (ADMIN) =================
BuyNowForMeRoutes.get(
  '/get-all-orders',
  apiKeyMiddleware,
  verifyToken,
  isBlocked,
  BuyNowForMeController.getAllOrders
);

// ================= UPDATE ORDER STATUS =================
BuyNowForMeRoutes.patch(
  '/update-order-status/:id',
  apiKeyMiddleware,
  verifyToken,
  isBlocked,
  BuyNowForMeController.updateOrderStatus
);

// ================= CREATE ORDER FOR SOMEONE =================
BuyNowForMeRoutes.post(
  '/create-order-someone',
  apiKeyMiddleware,
  verifyToken,
  isBlocked,
  BuyNowFormeValidator,
  validateRequest,
  BuyNowForMeController.createOrderSomeone
);

// ================= DELETE ORDER =================
BuyNowForMeRoutes.delete(
  '/delete-order/:id',
  apiKeyMiddleware,
  verifyToken,
  isBlocked,
  BuyNowForMeController.deleteOrder
);
BuyNowForMeRoutes.get('/get-seller-margin',apiKeyMiddleware,verifyToken,isBlocked,BuyNowForMeController.getSellerMarginData);
BuyNowForMeRoutes.get('/total-sales-for-admin',apiKeyMiddleware,verifyToken,isBlocked,isAdmin,BuyNowForMeController.totalSalesForAdmin);
BuyNowForMeRoutes.get('/total-sales-for-vendor',apiKeyMiddleware,verifyToken,isBlocked,isAdminOrVendor,BuyNowForMeController.totalSalesForVendor);
BuyNowForMeRoutes.get('/get-monthly-graph-admin',apiKeyMiddleware,verifyToken,isBlocked,isAdmin,BuyNowForMeController.getmonthlyGraphAdmin);

module.exports = BuyNowForMeRoutes;
