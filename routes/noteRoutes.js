// --- REQUIRES AND VARIABLES ------------------------------------------------------------

const express = require('express')
const router = express.Router()

// Import the controller functions
const {
    // READ actions
    getAllNotes, 
    getAllNotesByTags, 
    getOneNote, 

    // CREATE action
    postOneNote, 

    // UPDATE action
    patchOneNote, 
    addTagToNote,
    removeTagFromNote,

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
router.get('/filter/bytags', isAuthenticated, getAllNotesByTags) // will use query not params
router.get('/:id', isAuthenticated, getOneNote)

// POST
router.post('/', isAuthenticated, postOneNote)

// PATCH
router.patch('/:id', isAuthenticated, patchOneNote)
router.patch('/:id/tags/:tagId/add', isAuthenticated, addTagToNote)
router.patch('/:id/tags/:tagId/remove', isAuthenticated, removeTagFromNote)

// DELETE
router.delete('/', isAuthenticated, deleteAllNotes)
router.delete('/:id', isAuthenticated, deleteOneNote)


// --- MODULE EXPORT ------------------------------------------------------------------------

module.exports = router
