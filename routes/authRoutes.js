/*
    Copyright 2026 Julien Javelaud

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/


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
