const { check, body, validationResult } = require('express-validator')

const validateMultipleEnvelopes = [
    body('envelope_1[name]')
        .trim()
        .notEmpty()
        .withMessage('envelope name cannot be empty!')
        .bail()
        .isLength({min: 3, max: 30})
        .withMessage('envelope name must be between 3 and 30 letters')
        .bail()
        .escape()
        .toLowerCase(),
    body('envelope_1[monthlyBudget]')
        .trim()
        .notEmpty()
        .withMessage('monthly budget cannot be empty!')
        .bail()
        .isInt({gt: 1, lt: 1000000})
        .withMessage('monthly budget must be between $1 and $1,000,000')
        .bail()
        .escape(),
    body('envelope_2[name]')
        .trim()
        .notEmpty()
        .withMessage('envelope name cannot be empty!')
        .bail()
        .isLength({min: 3, max: 30})
        .withMessage('envelope name must be between 3 and 30 letters')
        .bail()
        .escape()
        .toLowerCase(),
    body('envelope_2[monthlyBudget]')
        .trim()
        .notEmpty()
        .withMessage('monthly budget cannot be empty!')
        .bail()
        .isInt({gt: 1, lt: 1000000})
        .withMessage('monthly budget must be between $1 and $1,000,000')
        .bail()
        .escape(),
    body('envelope_3[name]')
        .trim()
        .notEmpty()
        .withMessage('envelope name cannot be empty!')
        .bail()
        .isLength({min: 3, max: 30})
        .withMessage('envelope name must be between 3 and 30 letters')
        .bail()
        .escape()
        .toLowerCase(),
    body('envelope_3[monthlyBudget]')
        .trim()
        .notEmpty()
        .withMessage('monthly budget cannot be empty!')
        .bail()
        .isInt({gt: 1, lt: 1000000})
        .withMessage('monthly budget must be between $1 and $1,000,000')
        .bail()
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('create-envelopes', {
                errors: errors.array(),
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        }
        next();
    }
]


module.exports.validateMultipleEnvelopes = validateMultipleEnvelopes;