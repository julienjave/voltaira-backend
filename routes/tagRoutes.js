// --- REQUIRES AND VARIABLES ------------------------------------------------------------

const express = require('express')
const router = express.Router()

// Import the controller functions
const {
    // READ actions
    getAllTags, 
    getOneTag, 

    // CREATE action
    postOneTag, 

    // UPDATE action
    patchOneTag, 

    // DELETE actions
    deleteOneTag
} = require('../controllers/tagController')


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
router.get('/', isAuthenticated, getAllTags)
router.get('/:id', isAuthenticated, getOneTag)

// POST
router.post('/', isAuthenticated, postOneTag)

// PATCH
router.patch('/:id', isAuthenticated, patchOneTag)

// DELETE
router.delete('/:id', isAuthenticated, deleteOneTag)


// --- MODULE EXPORT ------------------------------------------------------------------------

module.exports = router
