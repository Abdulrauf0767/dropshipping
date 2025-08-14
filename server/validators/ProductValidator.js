let { check } = require('express-validator');

let ProductValidator = [
    check('name').not().isEmpty().withMessage('Name is required').escape(),
    check('description').not().isEmpty().withMessage('Description is required').escape(),
    check('price').not().isEmpty().withMessage('Price is required').escape(),
    check('discontPrice').isNumeric().withMessage('Discount price must be a number').optional().escape(),
    check('brand').escape().optional(),
    check('category').notEmpty().withMessage('Category is required').escape(),
    check('stock').isNumeric().withMessage('Stock must be a number').escape(),
    
    check('sizes')
        .custom(value => {
            if (typeof value === 'string') {
                try {
                    value = JSON.parse(value);
                } catch {
                    throw new Error('Sizes must be valid JSON array');
                }
            }
            if (!Array.isArray(value)) {
                throw new Error('Sizes must be an array');
            }
            return true;
        })
        .optional(),

    check('color')
        .custom(value => {
            if (typeof value === 'string') {
                try {
                    value = JSON.parse(value);
                } catch {
                    throw new Error('Color must be valid JSON array');
                }
            }
            if (!Array.isArray(value)) {
                throw new Error('Color must be an array');
            }
            return true;
        })
        .optional(),

    check('tags')
        .custom(value => {
            if (typeof value === 'string') {
                try {
                    value = JSON.parse(value);
                } catch {
                    throw new Error('Tags must be valid JSON array');
                }
            }
            if (!Array.isArray(value)) {
                throw new Error('Tags must be an array');
            }
            return true;
        })
        .notEmpty()
];

module.exports = ProductValidator;
