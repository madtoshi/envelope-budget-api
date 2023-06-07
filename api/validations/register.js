const { check, body, validationResult } = require('express-validator')

const validateRegistration = [
    body('first')
        .trim()
        .notEmpty()
        .withMessage('first name cannot be empty!')
        .bail()
        .isLength({min: 3, max: 20})
        .withMessage('first name must be between 3 and 20 letters')
        .bail()
        .escape()
        .toLowerCase(),
    body('last')
        .trim()
        .notEmpty()
        .withMessage('first name cannot be empty!')
        .bail()
        .isLength({min: 3, max: 20})
        .withMessage('last name must be between 3 and 20 letters')
        .bail()
        .escape()
        .toLowerCase(),
    body('email')
        .trim()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address. Retype and try it again.')
        .bail(),
    body('password')
        .isStrongPassword()
        .withMessage('Password must be atleast 8 characters in length, include upper and lowercase letters, numbers, and a unique symbol.'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('register', { errors: errors.array()});
            }
            next();
        }
];

module.exports.validateRegistration = validateRegistration;