const { check, body, validationResult } = require('express-validator')

const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address. Retype and try it again.')
        .bail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Invalid password. Retype and try it again.')
        .isLength({min: 3})
        .withMessage('Invalid password. Retype and try it again.')
        .bail(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('login', { errors: errors.array()});
            }
            next();
        }
];

module.exports.validateLogin = validateLogin