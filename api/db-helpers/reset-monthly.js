const { Transaction } = require("../models");
const { Envelope } = require("../models");
const cron = require("node-cron")

const resetMonthly = 
    // Monthly scheduled reset - wipe all transactions, reset any overspent 
    cron.schedule('0 3 1 * *', async () => {
    try {
        console.log('resetting user transactions at start of month');
        // Reset overspent column in db
        const numberOfOverspent = await Envelope.update({ overspent: false }, { where: { overspent: true }})
        // The number of users who overspent this last month
        console.log(numberOfOverspent)
        // Delete transactions from db
        await Transaction.destroy({ where: {}, truncate: true});
        console.log("all transactions for the month have been deleted")
    } catch (err) {
        console.log("unable to perform monthly reset", err);
    }
});


module.exports.resetMonthly = resetMonthly;