// --- REQUIRES AND VARIABLES ------------------------------------------------------------

const express = require('express')
const router = express.Router()

// Import the controller functions
const {
    // READ actions
    getAllUsers, 
    getOneUser, 

    // CREATE action
    postOneUser, 

    // UPDATE action
    patchOneUser, 

    // DELETE actions
    deleteOneUser
} = require('../controllers/userController')


// --- MIDDLEWARES -------------------------------------------------------------------------

// Middleware: Check authentication status
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next() // User is logged in, proceed to the controller
    }
    res.status(401).json({ message: "Unauthorized. Please log in first." })
}


// --- ENDPOINTS AND MATCHING FUNCTIONS ----------------------------------------------------

// GET
router.get('/', isAuthenticated, getAllUsers)
router.get('/:id', isAuthenticated, getOneUser)

// POST
router.post('/', isAuthenticated, postOneUser)

// PATCH
router.patch('/:id', isAuthenticated, patchOneUser)

// DELETE
router.delete('/:id', isAuthenticated, deleteOneUser)


// --- MODULE EXPORT ------------------------------------------------------------------------

module.exports = router
