let express = require('express');
let BuynowforSomeoneRoutes = express.Router();
let BuynowforSomeoneController = require('../controllers/BuyNowForSomeoneController');
let verifyToken = require('../middlewares/VerifyToken');
let apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let isBlocked = require('../middlewares/IsBlocked');
let BuyNowFormeValidator = require('../validators/BuyNowForMeValidator');
let validateRequest = require('../middlewares/ValidateRequest');

BuynowforSomeoneRoutes.post('/create-order',apiKeyMiddleware, verifyToken, isBlocked, BuyNowFormeValidator, validateRequest, BuynowforSomeoneController.createOrder);
BuynowforSomeoneRoutes.get('/get-orders', apiKeyMiddleware, verifyToken, isBlocked, BuynowforSomeoneController.getOrders);
BuynowforSomeoneRoutes.get('/get-order/:id', apiKeyMiddleware, verifyToken, isBlocked, BuynowforSomeoneController.getOrderById);
BuynowforSomeoneRoutes.delete('/delete-order/:id', apiKeyMiddleware, verifyToken, isBlocked, BuynowforSomeoneController.deleteOrder);
BuynowforSomeoneRoutes.put('/update-order/:id', apiKeyMiddleware, verifyToken, isBlocked, BuyNowFormeValidator, validateRequest, BuynowforSomeoneController.updateOrder);
BuynowforSomeoneRoutes.get('/get-all-orders', apiKeyMiddleware, verifyToken, isBlocked, BuynowforSomeoneController.getAllOrders);
BuynowforSomeoneRoutes.put('/update-order-status/:id', apiKeyMiddleware, verifyToken, isBlocked, BuynowforSomeoneController.updateOrderStatus);
BuynowforSomeoneRoutes.put('/update-payment-status/:id', apiKeyMiddleware, verifyToken, isBlocked, BuynowforSomeoneController.updatePaymentStatus);
module.exports = BuynowforSomeoneRoutes;