const passport = require("passport");
const { redisClient } = require("./redis-config")
const { User } = require("../models")
const { Envelope } = require("../models")
const { Transaction } = require("../models")
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

passport.use(
    new LocalStrategy({usernameField: 'email', passwordField: 'password'}, 
    async function verify(email, password, done) {
     const cachedUser = JSON.parse(await redisClient.get(`${email}`));
     if (cachedUser != null) {
       if (!await bcrypt.compare(password, cachedUser.hash)) {
         return done(null, false, { message: "Email or password does not match" });
       }
       return done(null, cachedUser);
     } 
     else {
       const user = await User.findOne({ where: { email: email }, include: [{ model: Envelope}, { model: Transaction }] });
       if (!user) {
         return done(null, false, { message: "Email or password does not match" });
       }
       if (!await bcrypt.compare(password, user.hash)) {
         return done(null, false, { message: "Email or password does not match" });
       } 
       redisClient.set(`${email}`, JSON.stringify(user), 'EX', 1800);
       return done(null, user);
     }
   }));

 passport.serializeUser((user, done) => {
   done(null, { id: user.id, email: user.email} );
 });

 passport.deserializeUser(async (userData, done) => {
  const email = userData.email;
  const cachedUser = JSON.parse(await redisClient.get(`${email}`));
  if (cachedUser) {
    return done(null, cachedUser)
  } else {
    const user = await User.findByPk(userData.id);
    if (!user) {
     return done(error, false);
    }
    return done(null, user);
  }
 });