let express = require('express');
let UserRoutes = express.Router();
let UserController = require('../controllers/UserController');
let ValidateRequest = require('../middlewares/ValidateRequest');
let ApiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let {SignupValidator, LoginValidator} = require('../validators/UserValidator');
let IsAdmin = require('../middlewares/IsAdmin');
let verifyToken = require('../middlewares/VerifyToken');


UserRoutes.post('/register',ApiKeyMiddleware,SignupValidator, ValidateRequest, UserController.register);
UserRoutes.post('/login',ApiKeyMiddleware,LoginValidator, ValidateRequest, UserController.login);
UserRoutes.get('/logout',ApiKeyMiddleware, UserController.logout);
UserRoutes.get('/all',ApiKeyMiddleware,verifyToken,IsAdmin, UserController.allUsers);
UserRoutes.patch('/block/:id',ApiKeyMiddleware,verifyToken,IsAdmin, UserController.blockUser);
UserRoutes.patch('/unblock/:id',ApiKeyMiddleware,verifyToken,IsAdmin, UserController.unblockUser);
UserRoutes.get('/blocked-users',ApiKeyMiddleware,verifyToken,IsAdmin, UserController.getBlockedUsers);
UserRoutes.get('/search-user',ApiKeyMiddleware,verifyToken, IsAdmin,UserController.searchUsers);
UserRoutes.get('/auth/me',ApiKeyMiddleware,verifyToken , (req,res) => {
    res.json({user : req.user})
} )

module.exports = UserRoutes