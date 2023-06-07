const express = require("express");
const router = express.Router();

const envelopesRouter = require("./envelopes.js");
const usersRouter = require("./users.js");
const transactionsRouter = require("./transactions.js");

const { validateRegistration } = require('../validations/register.js');
const { validateLogin } = require('../validations/login.js');

router.use("/envelopes", envelopesRouter);
router.use("/users", usersRouter);
router.use("/transactions", transactionsRouter);

const {
    Register,
    HomePage,
    LoginPage,
    RegisterPage,
    Logout
} = require("../controllers/index");

const passport = require("passport");

router
    .route("/login")
    .get(LoginPage)
    .post(validateLogin, passport.authenticate("local", {
        failureRedirect: "/login",
        failureMessage: true,
        failureFlash: true
      }),
      function(req, res) {
        res.redirect('/home');
    });

router
    .route("/register")
    .get(RegisterPage)
    .post(validateRegistration, Register)

router
    .route("/home")
    .get(HomePage);

router
    .route("/logout")
    .delete(Logout);


module.exports = router;