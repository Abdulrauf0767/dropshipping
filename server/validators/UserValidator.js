let {body} = require('express-validator');

let SignupValidator = [
    body('name').not().isEmpty().withMessage('Name is required').escape(),
    body('email').not().isEmpty().withMessage('Email is required').escape().isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters').escape()
]

let LoginValidator = [
    body('email').not().isEmpty().withMessage('Email is required').escape().isEmail().withMessage('Invalid email'),
    body('password').not().isEmpty().withMessage('Password is required').escape()
]

module.exports = {SignupValidator, LoginValidator}