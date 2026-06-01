// --- REQUIRES AND VARIABLES ------------------------------------------------------------

const express = require('express')
const router = express.Router()

// Import the controller functions
const {
    // READ actions
    getAllNotes, 
    getAllNotesByTag, 
    getOneNote, 

    // CREATE action
    postOneNote, 

    // UPDATE action
    patchOneNote, 

    // DELETE actions
    deleteOneNote, 
    deleteAllNotes
} = require('../controllers/noteController')


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
router.get('/', isAuthenticated, getAllNotes)
router.get('/bytag/:tag', isAuthenticated, getAllNotesByTag)
router.get('/onebyid/:id', isAuthenticated, getOneNote)

// POST
router.post('/', isAuthenticated, postOneNote)

// PATCH
router.patch('/', isAuthenticated, patchOneNote)

// DELETE
router.delete('/', isAuthenticated, deleteAllNotes)
router.delete('/onebyid/:id', isAuthenticated, deleteOneNote)


// --- MODULE EXPORT ------------------------------------------------------------------------

module.exports = {router}
