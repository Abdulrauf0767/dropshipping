let {check} = require('express-validator');

let sellerValidator = [
    check('phoneNumber').isMobilePhone().withMessage('Invalid phone number').escape(),
    check('bankNumber').notEmpty().withMessage('Bank number is required').escape()
]

module.exports = sellerValidator;