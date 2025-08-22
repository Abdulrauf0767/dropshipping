let  express = require('express');
let WithdrawRoutes = express.Router();
let WithdrawController = require('../controllers/WithdrawController');
let ApiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let verifyToken = require('../middlewares/VerifyToken');
let IsBlocked = require('../middlewares/IsBlocked');
let withdrawValidator = require('../validators/WithdrawValidator');
let validateRequest = require('../middlewares/ValidateRequest');

WithdrawRoutes.post('/create-withdraw',ApiKeyMiddleware,verifyToken,IsBlocked,withdrawValidator,validateRequest,WithdrawController.createWithdraw);
WithdrawRoutes.get('/all-pending',ApiKeyMiddleware,verifyToken,IsBlocked,WithdrawController.pendingWithdraws);
WithdrawRoutes.patch('/approve-withdraw/:id',ApiKeyMiddleware,verifyToken,IsBlocked,WithdrawController.approveWithdraw);
WithdrawRoutes.patch('/reject-withdraw/:id',ApiKeyMiddleware,verifyToken,IsBlocked,WithdrawController.rejectedWithdraw);
module.exports = WithdrawRoutes