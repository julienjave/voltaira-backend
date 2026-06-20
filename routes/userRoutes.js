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


// --- REQUIRES AND VARIABLES ------------------------------------------------------------

const express = require('express')
const router = express.Router()

// Import the controller functions
const {
    // READ actions
    getAllUsers, 
    getOneUser, 

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
// For security reason this route belongs to the authentication system

// PATCH
router.patch('/:id', isAuthenticated, patchOneUser)

// DELETE
router.delete('/me', isAuthenticated, deleteOneUser)


// --- MODULE EXPORT ------------------------------------------------------------------------

module.exports = router
