const { check, body, validationResult } = require('express-validator')

const validateLogTransactions = [
    body('amountSpent')
        .trim()
        .notEmpty()
        .withMessage('monthly budget cannot be empty!')
        .bail()
        .isInt({gt: 0, lt: 100000})
        .withMessage('amount spent must be between 1 and 100,000!')
        .bail()
        .escape(),
    body('notes')
        .if(body('newMonthlyBudget').exists({checkFalsy: true}))
        .escape()
        .trim()
        .stripLow()
        .isString()
        .isLength({min: 1, max: 50})
        .withMessage('notes must be between 1 and 50 characters!')
        .toLowerCase(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('log-transactions', { errors: errors.array(), user: req.user});
            }
            next();
        }
];

module.exports.validateLogTransactions = validateLogTransactions;