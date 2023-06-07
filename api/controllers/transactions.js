const { cache } = require('ejs');
const { redisClient } = require('../config/redis-config');
const { Transaction } = require('../models');
const { Envelope } = require('../models');


const LogTransactionsPage = async (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    res.render("log-transactions", {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        });
}

const logTransaction = async (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    }

    // Get transaction and envelope
    const transaction = req.body;
    const userEnvelope = req.user.Envelopes.find(({ name }) => name === req.body.envelopeName);
    /*
    if (transaction.amountSpent > userEnvelope.budgetRemaing) {
        return res.render("log-transactions", { errors: [{msg: 'Cannot spend more than budget remaining'}], user: req.user });
    }
    */
    
    // Add/modify some data for db 
    transaction.userId = req.user.id;
    transaction.amountSpent = Number(transaction.amountSpent);
    transaction.envelopeId = userEnvelope.id;
    if (transaction.notes === '') { delete transaction.notes};
    transaction.date = new Date().toISOString().slice(0, 10);
    

    try {

        // Create transaction in db
        const dbTransaction = await Transaction.create(transaction);
        console.log(dbTransaction)

        // Get user from Redis, update user with new transaction
        const user = req.user.email;
        const cachedUser = JSON.parse(await redisClient.get(user)); 
        console.log(cachedUser)    
        if (!cachedUser.Transactions) {
            cachedUser.Transactions = [];
        } 
        cachedUser.Transactions.push(transaction)
        console.log(cachedUser)
        
        // Get the envelope from cache and db
        const updateCachedEnvelope = cachedUser.Envelopes.find(({ name }) => name === req.body.envelopeName);
        const dbEnvelope = await Envelope.findOne({ where: { id: transaction.envelopeId }});
        console.log(updateCachedEnvelope)
        console.log(dbEnvelope)
        // Check if amount spent is greater than budget remaining of envelope
        console.log(transaction)
        if (transaction.amountSpent > updateCachedEnvelope.budgetRemaing) {
            // Mark envelope as overspent and disallow negative budget remaining, update on cachedEnvelope/db/req.user
            updateCachedEnvelope.overspent = true;
            updateCachedEnvelope.budgetRemaing = 0;
            userEnvelope.overspent = true;
            userEnvelope.budgetRemaing = 0;
            console.log(updateCachedEnvelope)
            console.log(userEnvelope)
            if (dbEnvelope) { 
                dbEnvelope.overspent = true; 
                dbEnvelope.budgetRemaing = 0;
                await dbEnvelope.save(); 
            } else {
                console.log("error updating dbEnvelope")
            }
        } else {
        // Otherwise update budget remaining with new budget remaining
        updateCachedEnvelope.budgetRemaing = updateCachedEnvelope.budgetRemaing - transaction.amountSpent
        userEnvelope.budgetRemaing = userEnvelope.budgetRemaing - transaction.amountSpent
        dbEnvelope.budgetRemaing = dbEnvelope.budgetRemaing - transaction.amountSpent
        await dbEnvelope.save();
        console.log(updateCachedEnvelope)
        console.log(dbEnvelope)
        console.log(userEnvelope)
        }

        // Set cache with updates
        await redisClient.set(user, JSON.stringify(cachedUser));

    }  catch (err) {
        return res.status(500).send({ error: 'Error creating transaction' });
    }
    
    res.redirect('/home');
}





module.exports = {
    LogTransactionsPage,
    logTransaction
}