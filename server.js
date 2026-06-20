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


// --- REQUIRES AND VARIABLES -----------------------------------------------------------------

const express = require("express")
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')

// Import the database connecting logic
const { connectDB } = require('./config/database')

// Import the routes
const authRoutes = require('./routes/authRoutes')
const noteRoutes = require('./routes/noteRoutes')
const userRoutes = require('./routes/userRoutes')
const tagRoutes = require('./routes/tagRoutes')

// Define the port dynamically
const PORT = process.env.PORT || 3000

// Initialize Express
const app = express()


// --- MIDDLEWARES -----------------------------------------------------------------------------


// Middleware: Allow for CORS
app.use(cors({
       origin: process.env.FRONTEND_ORIGIN, // Allow our Vite frontend dev server
       credentials: true                // Required to allow cookie sharing
   }))

// Middleware: for express to handle JSON
app.use(express.json())

app.set('trust proxy', 1);

// Middleware: Session (Creates the cookie settings)
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true, // Protects cookie from frontend JS tampering
        maxAge: 24 * 60 * 60 * 1000 // Cookie lasts 1 day
    }
}))


// --- PASSPORT -------------------------------------------------------------------------------

// Initialize Passport and connect Session
app.use(passport.initialize())
app.use(passport.session())

// Pass the passport instance into our config file
require('./config/passport')(passport)


// --- ROUTES ----------------------------------------------------------------------------------

// Root path catch
app.get('/', (req, res) => {
    res.status(200).json({ message: "Voltaira Backend Engine API is live!" });
})

// Auth
app.use('/auth', authRoutes)

// API
app.use('/users', userRoutes)
app.use('/notes', noteRoutes)
app.use('/tags', tagRoutes)


// --- SERVER START FUNCTION -------------------------------------------------------------------

async function startServer() {
    try {
        // Call the connection function from the module 'database.js'
        await connectDB()

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.log("Failed to connect.", error)
        process.exit()
    }
}

startServer()
