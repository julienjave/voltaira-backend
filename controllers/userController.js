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
// The user creation is the responsability of the authentication system
// See authController.js => registerUser()


// --- PATCH ROUTES ---------------------------------------------------------------

// 1. Patch one existing user by id
const patchOneUser = async (req, res) => {
    try {
        // { returnDocument: 'after' }: returns the freshly updated document instead of the old version
        // { runValidators: true }: forces the update to respect the Schema rules
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { returnDocument: 'after', runValidators: true }
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
        const userID = req.user.id

        // 1. Delete all notes from this user
        await Note.deleteMany({ user: userID })

        // 2. Delete all tags
        await Tag.deleteMany({ user: userID })

        // 3. Delete all folders
        await Folder.deleteMany({ user: userID})

        // 4. Delete this user
        await User.findByIdAndDelete(userID)

        // 5. INTEGRATE PASSPORT LOGOUT & SESSION CLEANUP
        // Passport's logout method unlinks the user property from the incoming request object
        req.logout((err) => {
            if (err) {
                console.error("Passport logout error:", err)
                return res.status(500).json({ message: "Failed to clear auth session" })
            }

            // Wipe the session data container out of our database/memory store (e.g., MongoStore or Redis)
            req.session.destroy((destroyErr) => {
                if (destroyErr) {
                    console.error("Session destruction error:", destroyErr)
                    return res.status(500).json({ message: "Failed to destroy session data" })
                }

                // Clear the browser's cookie container tracking this session identity
                // Note: 'connect.sid' is the default name express-session gives our cookie.
                res.clearCookie('connect.sid') 

                // 6. Finally, send the response back to our frontend fetch client
                return res.status(200).json({ message: "User and all associated data deleted successfully" })
            })
        })

    } catch (error) {
        res.status(500).json({ message: "Failed to delete user" })
    }
}



// --- MODULE EXPORT ---------------------------------------------------------------
module.exports = {
    getAllUsers,
    getOneUser,
    patchOneUser,
    deleteOneUser,
}
