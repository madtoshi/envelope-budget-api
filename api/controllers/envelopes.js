const { redisClient } = require('../config/redis-config');
const { Envelope } = require('../models');


const NewEnvelopesPage = async (req, res) => {
    if (!req.user) {
        return res.redirect("/login")
    }
    console.log(req.user.envelopes)
    res.render("create-envelopes", {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        });
   };

const UpdateEnvelopePage = async (req, res) => {
    if (!req.user) {
        return res.redirect("/login")
    }
    
    // Add the selected envelope to req.user
    let selectedEnvelope;
    if (req.query.envelopeId) {
        const envelopeId = Number(req.query.envelopeId)
        selectedEnvelope = req.user.Envelopes.find(({ id }) => id === envelopeId)
        req.user.selectedEnvelope = selectedEnvelope
    }
    
    res.render("edit-envelopes", {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        });
   };

   
const updateEnvelope = async (req, res) => {
    console.log(req.body)
    const newName = req.body.newName;
    const newMonthlyBudget = Number(req.body.newMonthlyBudget);
    const envelopeToUpdate = Number(req.body.envelopeId);

    // Both empty - try agin
    if (newName == '' && newMonthlyBudget == '') {
        res.redirect("/envelopes/update")
    }

    // Updating only monthly budget
    if (newName == '') {
        delete req.body.newName;
        console.log(req.body)
        try {
        
        // update in db
        await Envelope.update({ monthlyBudget: newMonthlyBudget, budgetRemaing: newMonthlyBudget },
             { where: { id: envelopeToUpdate }});
        // update on req.user
        const userEnvelope = req.user.Envelopes.find(({ id }) => id === envelopeToUpdate);
        console.log(userEnvelope)
        userEnvelope.monthlyBudget = newMonthlyBudget
        userEnvelope.budgetRemaing = newMonthlyBudget
        console.log(userEnvelope)
        console.log(req.user)
        // update in cache
        const cachedUser = JSON.parse(await redisClient.get(req.user.email));
        const cachedEnvelope = cachedUser.Envelopes.find(({ id }) => id === envelopeToUpdate)
        cachedEnvelope.monthlyBudget = newMonthlyBudget
        cachedEnvelope.budgetRemaing = newMonthlyBudget
        await redisClient.set(req.user.email, JSON.stringify(cachedUser))
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    // Updating only name
    if (newMonthlyBudget == '') {
        delete req.body.newMonthlyBudget;
        try {
        
        // update in db
        const updatedDbEnvelope = await Envelope.update({ name: newName },
             { where: { id: envelopeToUpdate }});
        // update on req.user
        const userEnvelope = req.user.Envelopes.find(({ id }) => id === envelopeToUpdate);
        userEnvelope.name = newName
        // update in cache
        const cachedUser = JSON.parse(await redisClient.get(req.user.email));
        const cachedEnvelope = cachedUser.Envelopes.find(({ id }) => id === envelopeToUpdate)
        console.log(cachedEnvelope)
        cachedEnvelope.name = newName
        await redisClient.set(req.user.email, JSON.stringify(cachedUser))
        } catch (error) {
            return res.status(500).send(error.message);
        }

    }
    

    // Updating both fields
    if (newName != '' && newMonthlyBudget != '') {
        try {

        // update in db
        const updatedDbEnvelope = await Envelope.update({ name: newName, monthlyBudget: newMonthlyBudget, budgetRemaing: newMonthlyBudget },
             { where: { id: envelopeToUpdate }});
        // update on req.user
        const userEnvelope = req.user.Envelopes.find(({ id }) => id === envelopeToUpdate);
        userEnvelope.name = newName
        userEnvelope.monthlyBudget = newMonthlyBudget
        userEnvelope.budgetRemaing = newMonthlyBudget
        // update in cache
        const cachedUser = JSON.parse(await redisClient.get(req.user.email));
        const cachedEnvelope = cachedUser.Envelopes.find(({ id }) => id === envelopeToUpdate)
        console.log(cachedEnvelope)
        cachedEnvelope.name = newName
        cachedEnvelope.monthlyBudget = newMonthlyBudget
        cachedEnvelope.budgetRemaing = newMonthlyBudget
        await redisClient.set(req.user.email, JSON.stringify(cachedUser))
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }
    
    res.redirect("/home")
    
}


// Get all envelopes
const getAllEnvelopes = async (req, res) => {
    try {
        const envelopes = await Envelope.findAll();
        return res.status(200).json({ envelopes });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

// Get envelopes by UserId
const getEnvelopesByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const userEnvelopes = await Envelope.findAll({
            where: { userId: id },
        });
        if (userEnvelopes) {
            return res.status(200).json({ userEnvelopes });
        }
        return res.status(404).send('User envelopes not found');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

// Checks if authenticated, then adds envelopes to Redis and db
const createEnvelopes = async (req, res) => {

    // Check if user object exists/Authenticated
    if (!req.user) {
        res.redirect("/login");
    }
    console.log(req.body)
    // Get new envelopes from req.body and user email from req.user
    const envelopes = req.body;
    const user = req.user.email;

    // Create the array to hold user's envelopes
    let envelopesArr = [];

    // Loop through user submitted envelopes
    for (const key of Object.keys(envelopes)) {
        const envelope = envelopes[key];

        // Add/modify some data 
        envelope.userId = req.user.id;
        envelope.budgetRemaing = Number(envelope.monthlyBudget);
        envelope.monthlyBudget = Number(envelope.monthlyBudget);

        // Push each to envelopes array
        envelopesArr.push(envelope);
    }

    // Filter out any empty envelopes
    const filteredArray = envelopesArr.filter((envelope) => envelope.monthlyBudget != 0);

    // Create envelopes, add them to user session and user object in Redis
    try {

        // Create envelopes in db
        const createdEnvelopes = await Envelope.bulkCreate(filteredArray);
        
        // Add envelope id from db to filtered array of envelopes
        createdEnvelopes.forEach((createdEnvelope) => {
                filteredArray.forEach((envelope) => {
                    if (createdEnvelope.dataValues.name === envelope.name) {
                        Object.assign(envelope, createdEnvelope.dataValues);
                    }
                });
        });
        
        // Get user from Redis cache
        const cachedUser = JSON.parse(await redisClient.get(user));
            
        // Update user object in Redis with new envelopes 
        if (!cachedUser.Envelopes) {
            cachedUser.Envelopes = filteredArray;
        } else {
            filteredArray.forEach((envelope) => {
                cachedUser.Envelopes.push(envelope)
            });
        }
        await redisClient.set(user, JSON.stringify(cachedUser));

        // Add envelopes to req.user
        if (!req.user.Envelopes) {
            req.user.Envelopes = filteredArray
        } else {
            filteredArray.forEach((envelope) => {
                req.user.Envelopes.push(envelope)
            });
        }
        
    }  catch (err) {
        return res.status(500).send({ error: 'Error creating envelope' });
    }
    
    res.redirect('/home');
}


const deleteEnvelope = async (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    }
    
    // Get envelope id to delete
    const envelopeToDelete = Number(req.body.envelopeId);
    
    // Find the envelope to delete
    try {

        // delete in db
        await Envelope.destroy({ where: { id: envelopeToDelete }});
        // delete on req.user
        const userEnvelopesToKeep = req.user.Envelopes.filter((envelope) => envelope.id != envelopeToDelete);
        req.user.Envelopes = userEnvelopesToKeep;
        // delete in cache
        const cachedUser = JSON.parse(await redisClient.get(req.user.email));
        const cachedEnvelopesToKeep = cachedUser.Envelopes.filter((envelope) => envelope.id != envelopeToDelete);
        cachedUser.Envelopes = cachedEnvelopesToKeep;
        await redisClient.set(req.user.email, JSON.stringify(cachedUser));
        } catch (error) {
            return res.status(500).send(error.message);
        }

    res.redirect('/home');
}



module.exports = {
    NewEnvelopesPage,
    createEnvelopes,
    getAllEnvelopes,
    getEnvelopesByUserId,
    updateEnvelope,
    UpdateEnvelopePage,
    deleteEnvelope
}