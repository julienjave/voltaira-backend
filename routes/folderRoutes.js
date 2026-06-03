// --- REQUIRES AND VARIABLES ------------------------------------------------------------

const express = require('express')
const router = express.Router()

// Import the controller functions
const {
    // READ actions
    getAllFolders, 
    getOneFolder, 

    // CREATE action
    postOneFolder, 

    // UPDATE action
    patchOneFolder, 

    // DELETE actions
    deleteOneFolder
} = require('../controllers/folderController')


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
router.get('/', isAuthenticated, getAllFolders)
router.get('/:id', isAuthenticated, getOneFolder)

// POST
router.post('/', isAuthenticated, postOneFolder)

// PATCH
router.patch('/:id', isAuthenticated, patchOneFolder)

// DELETE
router.delete('/:id', isAuthenticated, deleteOneFolder)


// --- MODULE EXPORT ------------------------------------------------------------------------

module.exports = router
