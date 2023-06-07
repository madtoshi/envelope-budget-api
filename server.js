const express = require("express");
const app = express();
require('dotenv').config();
const logger = require('morgan');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport'); 
const router = require('./api/routes/index.js');

// Server Port
const PORT = 3000;

// App middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(logger('dev'));

app.set('view engine', 'ejs');
/*
app.set("cache", )
*/

const { redisClient } = require("./api/config/redis-config");
const RedisStore = require("connect-redis").default;

// Session middleware configuration
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(
 session({
   store: new RedisStore({ client: redisClient }),
   secret: SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: {
     secure: false,  // if true only transmit cookie over https
     httpOnly: false, // if true prevent client side JS from reading the cookie
     maxAge: 1000 * 60 * 10, // session max age in milliseconds
   },
 })
);

require('./api/config/passport-local-config')
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(router);

const { resetMonthly } = require("./api/db-helpers/reset-monthly")

app.listen(PORT, () => {
    resetMonthly.start()
});
