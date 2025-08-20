let {check} = require('express-validator');

let DigiDokanValidator  = [
    check('seller_number').isMobilePhone().withMessage('Invalid phone number'),
    check('buyer_number').isMobilePhone().withMessage('Invalid phone number'),
    check('buyer_name').notEmpty().withMessage('Buyer name is required').escape(),
    check('buyer_address').notEmpty().withMessage('Buyer address is required').escape(),
    check('buyer_city').notEmpty().withMessage('Buyer city is required').escape(),
    check('piece').isNumeric().withMessage('Piece must be a number').escape().isInt({gt : 0}).withMessage('Piece must be greater than 0'),
    check('amount').isNumeric().withMessage('Amount must be a number').escape().isFloat({gt : 0}).withMessage('Amount must be greater than 0'),
    check('special_instruction').notEmpty().withMessage('Special instruction is required').escape(),
    check('product_name').notEmpty().withMessage('Product name is required').escape(),
    check('store_url').notEmpty().withMessage('Store url is required').escape(),
    check(' business_name').notEmpty().withMessage('Business name is required').escape(),
    check('origin').notEmpty().withMessage('Origin is required').escape(),
    check('gateway_id').notEmpty().withMessage('Gateway id is required').escape(),
    check('shipper_address').notEmpty().withMessage('Shipper address is required').escape(),
    check('shipper_name').notEmpty().withMessage('Shipper name is required').escape(),
    check('shipper_phone').isMobilePhone().withMessage('Invalid phone number'),
    check('shipment_type').notEmpty().withMessage('Shipment type is required').escape(),
    check('external_reference_no').notEmpty().withMessage('External reference no is required').escape(),
    check('weight').isNumeric().withMessage('Weight must be a number').escape().isFloat({gt : 0}).withMessage('Weight must be greater than 0'),
    check('pickup_id').notEmpty().withMessage('Pickup id is required').escape()
] 

module.exports = DigiDokanValidator