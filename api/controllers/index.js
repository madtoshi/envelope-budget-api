const { User } = require("../models");
const bcrypt = require("bcrypt");
const { redisClient } = require("../config/redis-config");


const Register = async (req, res) => {
    const { first, last, email, password } = req.body;
    try {
        const alreadyExists = await User.findOne({ where: { email: email }}).catch((err) => {
            console.log("Error: ", err)
        });
        if (alreadyExists) {
            return res.json({ error: "User with this email already exists!" });
        }
        const securedPass = await bcrypt.hash(password, 10).catch((err) => {
            console.log("Error: ", err);
            res.json({ error: "Cannot hash user password" })
        });
        const savedUser = await User.create({ first, last, email, hash: securedPass }).catch((err) => {
            console.log("Error: ", err)
            res.json({ error: "Cannot register user at the moment!" });
        })
        if (savedUser) {
            res.status(201);
            res.redirect('/login');
            
        }
    } catch (err) {
        console.log("Error: ", err);
        res.redirect('/register');
    
    }
};

const HomePage = async (req, res) => {
    if (!req.user) {
        return res.redirect("/login")
    }
   console.log(req.user)
    res.render("home", {
    sessionID: req.sessionID,
    sessionExpireTime: new Date(req.session.cookie.expires) - new Date(),
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    });
};

const LoginPage = async (req, res) => {
    res.render("login");
   };

const RegisterPage = async (req, res) => {
    res.render("register");
   };

const Logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }

      res.redirect("/login");
    });
   };


module.exports = {
    Register,
    HomePage,
    LoginPage,
    RegisterPage,
    Logout
}