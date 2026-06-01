// --- REQUIRES AND VARIABLES ----------------------------------------------------------

const express = require('express')
const router = express.Router()

// Import the controller functions
const {
    loginUser,
    logoutUser
} = require('../controllers/authController')


// --- ENDPOINTS AND MATCHING FUNCTIONS -------------------------------------------------

// LOGIN
router.post('/login', loginUser)

// LOGOUT
router.post('/logout', logoutUser)


// --- MODULE EXPORT --------------------------------------------------------------------

module.exports = {router}
