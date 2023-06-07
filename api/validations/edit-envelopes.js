const { check, body, validationResult } = require('express-validator')

const validateEditEnvelopes = [
    body('newName')
        .if(body('newName').exists({checkFalsy: true}))
        .trim()
        .isLength({min: 3, max: 30})
        .withMessage('envelope name must be between 3 and 30 letters')
        .bail()
        .escape(),
    body('newMonthlyBudget')
        .if(body('newMonthlyBudget').exists({checkFalsy: true}))
        .isInt({gt: 0, lt: 1000000})
        .withMessage('monthly budget must be between 1 and $1,000,000!')
        .bail(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('edit-envelopes', { errors: errors.array(), user: req.user});
            }
            next();
        }
];

module.exports.validateEditEnvelopes = validateEditEnvelopes;