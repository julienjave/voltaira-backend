// Import Mongoose model
const User = require('../models/User')
const Note = require('../models/Note')
const Tag = require('../models/Tag')
const Folder = require('../models/Folder')


// --- GET ROUTES ----------------------------------------------------------------

// 1. Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Server error retrieving users" })
    }
}

// 2. Get one user by id
const getOneUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({ message: "Error finding user" })
    }
}


// --- POST ROUTES ----------------------------------------------------------------

// 1. Post one new user
const postOneUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
    
        const newUser = new User({
            username: username,
            email: email,
            password: password
        })
        
        const savedUser = await newUser.save()
    
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(400).json({ message: "Failed to create user", error: error.message })
    }
}


// --- PATCH ROUTES ---------------------------------------------------------------

// 1. Patch one existing user by id
const patchOneUser = async (req, res) => {
    try {
        // { new: true }: returns the freshly updated document instead of the old version
        // { runValidators: true }: forces the update to respect the Schema rules
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
}


// --- DELETE ROUTES --------------------------------------------------------------

// 1. Delete one user by id
const deleteOneUser = async (req, res) => {
    try {
        const userID = req.params.id

        // 1. Delete all notes from this user
        await Note.deleteMany({ user: userID })

        // 2. Delete all tags
        await Tag.deleteMany({ user: userID })

        // 3. Delete all folders
        await Folder.deleteMany({ user: userID})

        // 4. Delete this user
        await User.findByIdAndDelete(req.params.id)

        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user" })
    }
}



// --- MODULE EXPORT ---------------------------------------------------------------
module.exports = {
    getAllUsers,
    getOneUser,
    postOneUser,
    patchOneUser,
    deleteOneUser,
}
