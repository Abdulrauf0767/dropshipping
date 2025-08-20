let express = require('express');
let DigiRoutes = express.Router();
let DigiController = require('../controllers/DigiDokaanBookOrderController');
let ApiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let verifyToken = require('../middlewares/VerifyToken');
let IsBlocked = require('../middlewares/IsBlocked');

DigiRoutes.get('/get/cities',ApiKeyMiddleware,verifyToken,IsBlocked,DigiController.getCities);

module.exports = DigiRoutes