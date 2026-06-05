// --- REQUIRES AND VARIABLES ---------------------------------------------------------

const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/User')


// --- REGISTRATION ROUTE -------------------------------------------------------------

const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        // 1. Basic validation inputs check
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please enter all required fields" })
        }

        // 2. Check if a user profile already exists with this email address
        const userExists = await User.findOne({ email: email.toLowerCase().trim() })
        if (userExists) {
            return res.status(400).json({ message: "An account with that email already exists" })
        }

        // 3. Hash the raw password safely before saving to MongoDB
        // 10 salt rounds provides excellent protection without slowing down processing speeds
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // 4. Instantiate the new user document instance
        const newUser = new User({
            username: username,
            email: email.toLowerCase().trim(),
            password: hashedPassword // Save the secure hash
        })

        const savedUser = await newUser.save()

        // 5. Automatic Session Login: Log the user in instantly upon registration success
        req.logIn(savedUser, (err) => {
            if (err) return next(err)
            
            return res.status(201).json({
                message: "Registration successful and session established!",
                user: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email
                }
            })
        })

    } catch (error) {
        return next(error)
    }
}


// --- LOGIN ROUTE --------------------------------------------------------------------

const loginUser = (req, res, next) => {
    // Triggers the LocalStrategy configuration we wrote in config/passport.js
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message })
        
        // Establish session login
        req.logIn(user, (err) => {
            if (err) return next(err)
            return res.status(200).json({ 
                message: "Successfully logged in!", 
                user: { 
                    id: user._id, 
                    username: user.username, 
                    email: user.email
                } 
            })
        })
    })(req, res, next)
}


// --- LOGOUT ROUTE --------------------------------------------------------------------

const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" })
        res.status(200).json({ message: "Successfully logged out!" })
    })
}


// --- MODULE EXPORT -------------------------------------------------------------------

module.exports = {
    registerUser,
    loginUser, 
    logoutUser
}
