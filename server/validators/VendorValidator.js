let { check } = require('express-validator');

let vendorValidator = [
    check('storeName')
        .notEmpty().withMessage('Store name is required')
        .trim().escape(),

    check('storeDescription')
        .notEmpty().withMessage('Store description is required')
        .trim().escape(),

    check('phoneNumber')
        .notEmpty().withMessage('Phone number is required')
        .isNumeric().withMessage('Phone number must be numeric'),

    check('CNIC')
        .notEmpty().withMessage('CNIC is required')
        .isNumeric().withMessage('CNIC must be numeric'),

    check('address')
        .notEmpty().withMessage('Address is required')
        .trim().escape(),

    check('city')
        .notEmpty().withMessage('City is required')
        .trim().escape(),

    check('postalCode')
        .notEmpty().withMessage('Postal code is required')
        .isNumeric().withMessage('Postal code must be numeric'),

    check('accountNumber')
        .notEmpty().withMessage('Account number is required')
        .trim().escape(),

    check('country')
        .notEmpty().withMessage('Country is required')
        .trim().escape(),

   check('websiteURL')
  .optional({ checkFalsy: true }) // <- ye empty string ("") ko bhi ignore karega
  .isURL().withMessage('Website URL must be a valid URL')
  .trim().escape(),
];

module.exports = vendorValidator;
