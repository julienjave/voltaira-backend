// --- REQUIRES AND VARIABLES ----------------------------------------------------------

const express = require('express')
const router = express.Router()


// Import the controller functions
const {
    registerUser,
    loginUser,
    logoutUser,
    checkStatus
} = require('../controllers/authController')


// --- ENDPOINTS AND MATCHING FUNCTIONS -------------------------------------------------

// REGISTER
router.post('/register', registerUser)

// LOGIN
router.post('/login', loginUser)

// LOGOUT
router.post('/logout', logoutUser)

// STATUS
router.get('/status', checkStatus)


// --- MODULE EXPORT --------------------------------------------------------------------

module.exports = router
