const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Transaction } = require("../models");

const { validateLogTransactions } = require("../validations/log-transactions");

const {
    LogTransactionsPage,
    logTransaction
} = require("../controllers/transactions");

router
    .route("/log-transactions")
    .get(LogTransactionsPage)
    .post(validateLogTransactions, logTransaction)

module.exports = router