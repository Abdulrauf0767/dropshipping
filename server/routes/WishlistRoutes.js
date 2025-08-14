let express = require('express');
let WishlistRoutes = express.Router();
let WishlistController = require('../controllers/WishlistController');
let ApiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let IsBlocked = require('../middlewares/IsBlocked');
let verifyToken = require('../middlewares/VerifyToken');

WishlistRoutes.post('/add/:id', ApiKeyMiddleware, verifyToken, IsBlocked, WishlistController.addProduct);
WishlistRoutes.get('/all', ApiKeyMiddleware, verifyToken, IsBlocked, WishlistController.getWishlist);
WishlistRoutes.delete('/remove/:id', ApiKeyMiddleware, verifyToken, IsBlocked, WishlistController.removeProduct);
module.exports = WishlistRoutes