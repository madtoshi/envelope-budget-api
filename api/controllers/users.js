const { User, Envelope } = require('../models');
const { Op } = require('sequelize');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

// Get user by id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id: id },
            include: [
                {
                    model: Envelope
                }
            ]
        });
        if (user) {
            return res.status(200).json({ user });
        }
        return res.status(404).send('User with the specified ID does not exists');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

// Check if user exists
const checkUserExists = async (req, res) => {
    const foundUser = User.findOne({ where: { email: email }}).catch((err) => {
        console.log("Error: ", err)
    });
    if (foundUser) {
        return true
    } else {
        return false;
    }
}

// Update user by id
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await User.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedUser = await User.findOne({ where: { id: id } });
            return res.status(200).json({ user: updatedUser });
        }
        throw new Error('User not found');
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.status(201).json({
            user,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// Delete user by id
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.destroy({
            where: { id: id }
        });
        if (deleted) {
            return res.status(204).send("User deleted");
        }
        throw new Error("User not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

// Get users with envelopes, envelopes included
const getUsersWithEnvelopes = async (req, res) => {
    try {
        const usersWithEnvelopes = await User.findAll({ 
            include: {
                model: Envelope,

                required: true
            }
         });
        return res.status(200).json({ usersWithEnvelopes });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

// Get users without envelopes
const getUsersWithoutEnvelopes = async (req, res) => {
    try {
        const usersWithoutEnvelopes = await User.findAll({ 
            where: {
                [Op.or]: [
                    { '$Envelopes.UserId$': { [Op.ne]: req.userId } },
                    { '$Envelopes.UserId$': { [Op.is]: null } }
                ]
            },
            include: {
                model: Envelope,
                duplicating: false
            }
         });
        return res.status(200).json({ usersWithoutEnvelopes });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


module.exports = {
    createUser,
    checkUserExists,
    updateUser,
    deleteUser,
    getAllUsers,
    getUsersWithEnvelopes,
    getUsersWithoutEnvelopes,
    getUserById
}
