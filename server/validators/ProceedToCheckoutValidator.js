let {check} = require('express-validator');

let ProceedTocheckoutValidator = [
  check('userName').notEmpty().withMessage('Name is required').trim().escape(),
  check('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  check('phone').isMobilePhone().withMessage('Invalid phone number'),
  
  check('products').isArray({ min: 1 }).withMessage('At least one product is required'),
  check('products.*.product').notEmpty().withMessage('Product ID is required'),
  check('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  check('products.*.priceAtPurchase').isFloat({ gt: 0 }).withMessage('Price at purchase must be greater than 0'),
  
  check('marginPrice').optional({ checkFalsy: true }).isNumeric().withMessage('Margin price must be a number').isFloat({ gt: 0 }).withMessage('Margin price must be greater than 0'),
  check('price').isNumeric().withMessage('Price must be a number').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),

  check('address').notEmpty().withMessage('Address is required').trim().escape(),
  check('city').notEmpty().withMessage('City is required').trim().escape(),
  check('country').notEmpty().withMessage('Country is required').trim().escape(),
  check('province').custom(value => {
    if (value === 'none') {
      throw new Error('Select a province');
    }
    return true;
  })
];

module.exports = ProceedTocheckoutValidator