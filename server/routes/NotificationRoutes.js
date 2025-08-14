let express = require('express');
let NotificationRoutes = express.Router();
let NotificationController = require('../controllers/NotificationController');
let ApiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let verifyToken = require('../middlewares/VerifyToken');
let IsBlocked = require('../middlewares/IsBlocked');

NotificationRoutes.get('/all', ApiKeyMiddleware, verifyToken, IsBlocked, NotificationController.getNotifications);
NotificationRoutes.put('/mark-as-read/:id', ApiKeyMiddleware, verifyToken, IsBlocked, NotificationController.markAsRead);
module.exports = NotificationRoutes