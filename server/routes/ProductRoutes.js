// routes/ProductRoutes.js
let express = require('express');
let ProductRoutes = express.Router();
let ProductController = require('../controllers/ProductController');
let ProductValidator = require('../validators/ProductValidator');
let ValidateRequest = require('../middlewares/ValidateRequest');
let verifyToken = require('../middlewares/VerifyToken');
let ApiKeyMiddleware = require('../middlewares/ApiKeyMiddleware');
let ProductUpload = require('../middlewares/ProductMulter');
let IsAdminOrVendor = require('../middlewares/IsAdminOrVendor');
let IsAdmin = require('../middlewares/IsAdmin');
// CREATE product (multiple images)
ProductRoutes.post(
    '/create',
    ApiKeyMiddleware,
    verifyToken,
    IsAdminOrVendor,
    ProductUpload('image', 10, 5), // fieldName = "images", size=10MB, maxCount=5
    ProductValidator,
    ValidateRequest,
    ProductController.createProduct
);

// GET all products
ProductRoutes.get('/all', ApiKeyMiddleware, ProductController.getAllProducts);

// GET by ID
ProductRoutes.get('/getbyid/:id', ApiKeyMiddleware, verifyToken,  ProductController.getProductById);

// DELETE by ID
ProductRoutes.delete('/deletebyid/:id', ApiKeyMiddleware, verifyToken, IsAdminOrVendor, ProductController.deleteProductById);

// UPDATE product (multiple images allowed)
ProductRoutes.patch(
    '/update/:id',
    ApiKeyMiddleware,
    verifyToken,
    IsAdminOrVendor,
    ProductUpload('image', 10, 5),
    ProductValidator,
    ValidateRequest,
    ProductController.updateProductById
);

// SEARCH
ProductRoutes.get('/search', ApiKeyMiddleware,verifyToken, ProductController.searchProduct);

// GET by category
ProductRoutes.get('/category', ApiKeyMiddleware,verifyToken, ProductController.getProductByCategory);
ProductRoutes.get('/all-category', ApiKeyMiddleware,verifyToken,IsAdminOrVendor, ProductController.allCategoriesofProduct);
ProductRoutes.get('/all-product', ApiKeyMiddleware,verifyToken,IsAdmin, ProductController.allProductDataAdmin);
ProductRoutes.get('/user-product', ApiKeyMiddleware,verifyToken, IsAdminOrVendor,ProductController.getProductByUser);

// inactive product
ProductRoutes.patch('/inactive/:id', ApiKeyMiddleware, verifyToken, IsAdmin, ProductController.makingProductInactive);

// finish discount
ProductRoutes.patch('/finish-discount/:id', ApiKeyMiddleware, verifyToken, IsAdminOrVendor, ProductController.finishDiscount);

// add discount
ProductRoutes.patch('/add-discount/:id', ApiKeyMiddleware, verifyToken, IsAdminOrVendor, ProductController.addDiscount);

// active product
ProductRoutes.patch('/active/:id', ApiKeyMiddleware, verifyToken, IsAdmin, ProductController.makeProductActive);

module.exports = ProductRoutes;
