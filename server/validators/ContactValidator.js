let {check} = require('express-validator');

let contactValidator = [
    check('name').notEmpty().withMessage('Name is required').trim().escape(),
    check('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    check('subject').notEmpty().withMessage('Subject is required').trim().escape(),
    check('message').notEmpty().withMessage('Message is required').trim().escape()
]
module.exports = contactValidator