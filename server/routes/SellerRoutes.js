let express = require('express');
let SellerRoutes = express.Router();
let SellerController = require('../controllers/SellerController');
let verifyToken = require('../middlewares/VerifyToken');
let apiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let isBlocked = require('../middlewares/IsBlocked');
let sellerValidator = require('../validators/SellerValidator');
let validateRequest = require('../middlewares/ValidateRequest');
SellerRoutes.post('/create-seller', apiKeyMiddleware, verifyToken, isBlocked, sellerValidator, validateRequest, SellerController.createSeller);
SellerRoutes.get('/get-seller', apiKeyMiddleware, verifyToken, isBlocked, SellerController.getSeller);
SellerRoutes.put('/block-seller', apiKeyMiddleware, verifyToken, isBlocked, SellerController.blockSeller);
module.exports = SellerRoutes