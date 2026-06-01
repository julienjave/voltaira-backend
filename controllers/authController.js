// --- REQUIRES AND VARIABLES ---------------------------------------------------------

const passport = require('passport')


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
    loginUser, 
    logoutUser
}
