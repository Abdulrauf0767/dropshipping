let express = require('express');
let CartRoutes = express.Router();
let CartController = require('../controllers/CartController');
let ApiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let verifyToken = require('../middlewares/VerifyToken');
let IsBlocked = require('../middlewares/IsBlocked');

CartRoutes.post('/add/:id', ApiKeyMiddleware, verifyToken, IsBlocked, CartController.addToCart);
CartRoutes.get('/all', ApiKeyMiddleware, verifyToken, IsBlocked, CartController.getCart);
CartRoutes.delete('/remove/:id', ApiKeyMiddleware, verifyToken, IsBlocked, CartController.removeFromCart);
CartRoutes.put('/update/:id', ApiKeyMiddleware, verifyToken, IsBlocked, CartController.updateQuantity);
CartRoutes.get('/get/:id', ApiKeyMiddleware, verifyToken, IsBlocked, CartController.getCartDatabyId);
module.exports = CartRoutes