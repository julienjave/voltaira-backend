// --- REQUIRES AND VARIABLES -------------------------------------------------------------------

const { mongoose, Schema } = require('mongoose')


// --- SCHEMA -----------------------------------------------------------------------------------

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


// --- MODULE EXPORT -------------------------------------------------------------------------------

module.exports = mongoose.model('User', UserSchema)
