let {check} = require('express-validator') ;

let BuyNowForSomeoneValidator = [
    check('userName').notEmpty().withMessage('Name is required').escape(),
    check('marginPrice').isNumeric().withMessage('Margin price must be a number').escape().isFloat({gt : 0}).withMessage('Margin price must be greater than 0'),
    check('email').isEmail().withMessage('Invalid email').escape(),
    check('phone').isMobilePhone().withMessage('Invalid phone number').escape(),
    check('price').isNumeric().withMessage('Price must be a number').escape().isFloat({gt : 0}).withMessage('Price must be greater than 0'),
    check('address').notEmpty().withMessage('Address is required').escape(),
    check('city').notEmpty().withMessage('City is required').escape(),
    check('country').notEmpty().withMessage('Country is required').escape(),
    check('province').notEmpty().withMessage('Province is required').escape(),
    check('postalCode').notEmpty().withMessage('Postal code is required').escape().isNumeric().withMessage('Postal code must be a number'),
    check('productColor').notEmpty().withMessage('Product color is required').escape(),
    check('productSize').optional().escape(),
    check('quantity').isNumeric().withMessage('Quantity must be a number').escape().isInt({gt : 0}).withMessage('Quantity must be greater than 0'),
    check('paymentMethod').notEmpty().withMessage('Payment method is required').escape(),
    check('deliveryCharge').isNumeric().notEmpty().withMessage('Delivery charge is required').escape().isFloat({gt : 0}).withMessage('Delivery charge must be greater than 0'),
    check('total').isNumeric().withMessage('Total must be a number').escape().isFloat({gt : 0}).withMessage('Total must be greater than 0'),
]

module.exports = BuyNowForSomeoneValidator