// --- REQUIRES AND VARIABLES ----------------------------------------------------------

const express = require('express')
const router = express.Router()


// Import the controller functions
const {
    registerUser,
    loginUser,
    logoutUser
} = require('../controllers/authController')


// --- ENDPOINTS AND MATCHING FUNCTIONS -------------------------------------------------

// REGISTER
router.post('/register', registerUser)

// LOGIN
router.post('/login', loginUser)

// LOGOUT
router.post('/logout', logoutUser)


// --- MODULE EXPORT --------------------------------------------------------------------

module.exports = router
