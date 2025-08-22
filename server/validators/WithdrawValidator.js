let {check} = require('express-validator');
let withdrawValidator = [
    check('bankNumber').not().isEmpty().withMessage('Bank Number is required').escape(),
    check('bankName').not().isEmpty().withMessage('Bank Name is required').escape(),
    check('bankType').not().isEmpty().withMessage('Bank Type is required'),
    check('amount').not().isEmpty().withMessage('Amount is required').isNumeric().withMessage('Amount must be a number').escape().isFloat({gt : 0}).withMessage('Amount must be greater than 0'),
]

module.exports = withdrawValidator