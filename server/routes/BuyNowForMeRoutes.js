let express = require('express');
let BuyNowForMeRoutes = express.Router();
let BuyNowForMeController = require('../controllers/BuyNowForMeController');
let verifyToken = require('../middlewares/VerifyToken');
let apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let isBlocked = require('../middlewares/IsBlocked');
let BuyNowFormeValidator = require('../validators/BuyNowForMeValidator');
let validateRequest = require('../middlewares/ValidateRequest');

BuyNowForMeRoutes.post('/create-order',apiKeyMiddleware, verifyToken, isBlocked, BuyNowFormeValidator, validateRequest, BuyNowForMeController.createOrder);
BuyNowForMeRoutes.get('/get-orders', apiKeyMiddleware, verifyToken, isBlocked, BuyNowForMeController.getOrders);
BuyNowForMeRoutes.get('/get-order/:id', apiKeyMiddleware, verifyToken, isBlocked, BuyNowForMeController.getOrderById);
BuyNowForMeRoutes.delete('/delete-order/:id', apiKeyMiddleware, verifyToken, isBlocked, BuyNowForMeController.deleteOrder);
BuyNowForMeRoutes.put('/update-order/:id', apiKeyMiddleware, verifyToken, isBlocked, BuyNowFormeValidator, validateRequest, BuyNowForMeController.updateOrder);
BuyNowForMeRoutes.get('/get-all-orders', apiKeyMiddleware, verifyToken, isBlocked, BuyNowForMeController.getAllOrders);
BuyNowForMeRoutes.put('/update-order-status/:id', apiKeyMiddleware, verifyToken, isBlocked, BuyNowForMeController.updateOrderStatus);
BuyNowForMeRoutes.put('/update-payment-status/:id', apiKeyMiddleware, verifyToken, isBlocked, BuyNowForMeController.updatePaymentStatus);
module.exports = BuyNowForMeRoutes;