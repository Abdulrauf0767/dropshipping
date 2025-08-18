let express = require('express');
let ProceedToCheckoutRoutes = express.Router();
let ProceedToCheckoutController = require('../controllers/ProceedToCheckoutController');
let verifyToken = require('../middlewares/VerifyToken');
let ApiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let isBlocked = require('../middlewares/IsBlocked');
let proceedToCheckoutValidation = require('../validators/ProceedToCheckoutValidator');
let validateRequest = require('../middlewares/ValidateRequest');
let isAdminOrVendor = require('../middlewares/IsAdminOrVendor');
let isAdmin = require('../middlewares/IsAdmin');

ProceedToCheckoutRoutes.post('/add-product-me', ApiKeyMiddleware, verifyToken, isBlocked, proceedToCheckoutValidation, validateRequest, ProceedToCheckoutController.orderForYou);
ProceedToCheckoutRoutes.post('/add-product-someone', ApiKeyMiddleware, verifyToken, isBlocked, proceedToCheckoutValidation, validateRequest, ProceedToCheckoutController.orderForSomeone);
ProceedToCheckoutRoutes.get('/user-order', ApiKeyMiddleware, verifyToken, isBlocked, isAdminOrVendor,ProceedToCheckoutController.getMyOrders);
ProceedToCheckoutRoutes.get('/all-order', ApiKeyMiddleware, verifyToken, isBlocked, isAdmin, ProceedToCheckoutController.getAllOrders);
ProceedToCheckoutRoutes.patch('/update-status/:orderId', ApiKeyMiddleware, verifyToken, isBlocked, isAdmin, ProceedToCheckoutController.updateOrderStatus);
ProceedToCheckoutRoutes.patch('/reject-order/:orderId', ApiKeyMiddleware, verifyToken, isBlocked, isAdmin, ProceedToCheckoutController.rejectOrder);
module.exports = ProceedToCheckoutRoutes

