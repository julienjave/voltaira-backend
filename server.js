// --- REQUIRES AND VARIABLES -----------------------------------------------------------------

const { ObjectId } = require('mongodb')
const express = require("express")
const session = require('express-session')
const passport = require('passport')

// Import the database connecting logic
const { connectToServer, getDb } = require('./database')

// Import the routes
const authRoutes = require('./routes/authRoutes')
const noteRoutes = require('./routes/noteRoutes')

// Define the port dynamically
const PORT = process.env.PORT || 3000

// Initialize Express
const app = express()


// --- MIDDLEWARES -----------------------------------------------------------------------------


// Middleware: Allow for CORS
app.use((req, res, next) => {
    // Allows for CORS (Cross Origin Resource Sharing)
    res.set(`Access-Control-Allow-Origin`, `*`)
    res.set(`Access-Control-Allow-Headers`, `Content-Type`)

    // What methods are allowed
    if (req.method === `OPTIONS`) {
        res.set(`Access-Control-Allow-Methods`, `POST,PATCH,DELETE`)
        return res.sendStatus(204) // Success with no content
    }

    next()
})

// Middleware: store the database in `req`
// `req.db` now asks the database module for the current connection.
app.use((req, res, next) => {
    try {
        req.db = getDb()
        next()
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// Middleware: for express to handle JSON
app.use(express.json())

// Middleware: Session (Creates the cookie settings)
app.use(session({
    secret: 'voltaira_secret_key', // In production, move this to your .env file!
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true only if using HTTPS
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

// Auth
app.use('/auth', authRoutes)

// API
app.use('/notes', noteRoutes)


// --- SERVER START FUNCTION -------------------------------------------------------------------

async function startServer() {
    try {
        // Call the connection function from the module 'database.js'
        await connectToServer()

        app.listen(PORT, () => {
            console.log("Server running on port 3000")
        })
    } catch (error) {
        console.log("Failed to connect.", error)
        process.exit()
    }
}

startServer()
