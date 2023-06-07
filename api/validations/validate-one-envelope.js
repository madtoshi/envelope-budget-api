const { check, body, validationResult } = require('express-validator')

const validateOneEnvelope = [
    body('New_envelope[name]')
        .trim()
        .notEmpty()
        .withMessage('envelope name cannot be empty!')
        .bail()
        .isLength({min: 3, max: 30})
        .withMessage('envelope name must be between 3 and 30 letters')
        .bail()
        .escape()
        .toLowerCase(),
    body('New_envelope[monthlyBudget]')
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


module.exports.validateOneEnvelope = validateOneEnvelope;