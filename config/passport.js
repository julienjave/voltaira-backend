// --- REQUIRES AND VARIABLES ---------------------------------------------------------

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')


// --- MODULE EXPORT ------------------------------------------------------------------

module.exports = function(passport) {
    // 1. Define the Local Strategy
    passport.use(
        new LocalStrategy(
            async (username, password, done) => {
                try {
                    // 1. Check if user exists
                    const user = await User.findOne(username)
                    if (!user) {
                        return done(null, false, { message: 'Incorrect credentials.' })
                    }

                    // 2. Match hashed password
                    const isMatch = await bcrypt.compare(password, user.password)
                    if (!isMatch) {
                        return done(null, false, { message: 'Incorrect credentials.' })
                    }

                    // Success: pass the user object to the next step
                    return done(null, user)
                } catch (err) {
                    return done(err)
                }
            }
        )
    )

    // 2. Session Serialization (Determines what data is saved in the session cookie)
    passport.serializeUser((user, done) => {
        done(null, user.id); // Only store the light user ID in the session store
    })

    // 3. Session Deserialization (Retrieves the full user object on subsequent requests)
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            done(null, user) // Attaches the full user object to `req.user`
        } catch (err) {
            done(err)
        }
    })
}