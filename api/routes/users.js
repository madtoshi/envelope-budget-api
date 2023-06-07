const express = require("express");
const router = express.Router();
const userControllers = require('../controllers/users.js');

// Get only users with envelopes (envelopes included), or get only users without envelopes
router.get('/envelopes', userControllers.getUsersWithEnvelopes)
router.get('/no-envelopes', userControllers.getUsersWithoutEnvelopes)

// Routes that include an id param, calling user-specific controllers 
router
    .route('/:id')
    .get(userControllers.getUserById)
    .put(userControllers.updateUser)
    .delete(userControllers.deleteUser)

// Routes without id param, calling user-specific controllers
router
    .route('/')
    .get(userControllers.getAllUsers)
    
/*
router.get('/new', (req, res) => {
    res.render("users/new");
}); 
*/


module.exports = router
