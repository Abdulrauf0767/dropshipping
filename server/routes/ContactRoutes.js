let express = require('express');
let ContactRoutes = express.Router();
let ContactController = require('../controllers/ContactController');
let ApiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let verifyToken = require('../middlewares/VerifyToken');
let IsBlocked = require('../middlewares/IsBlocked');

ContactRoutes.post('/add', ApiKeyMiddleware, verifyToken, IsBlocked, ContactController.sendMessage);
ContactRoutes.get('/all', ApiKeyMiddleware, verifyToken, IsBlocked, ContactController.getAllMessages);
ContactRoutes.delete('/remove/:id', ApiKeyMiddleware, verifyToken, IsBlocked, ContactController.deleteMessage);
module.exports = ContactRoutes