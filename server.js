// --- REQUIRES AND VARIABLES -----------------------------------------------------------------

const express = require("express")
const session = require('express-session')
const passport = require('passport')

// Import the database connecting logic
const { connectDB } = require('./config/database')

// Import the routes
const authRoutes = require('./routes/authRoutes')
const noteRoutes = require('./routes/noteRoutes')
const userRoutes = require('./routes/userRoutes')
const folderRoutes = require('./routes/folderRoutes')
const tagRoutes = require('./routes/tagRoutes')

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

// Middleware: for express to handle JSON
app.use(express.json())

// Middleware: Session (Creates the cookie settings)
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
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
app.use('/folders', folderRoutes)
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
