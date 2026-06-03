// --- REQUIRES AND VARIABLES -------------------------------------------------------------------

const { mongoose, Schema } = require('mongoose')


// --- SCHEMA -----------------------------------------------------------------------------------

const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Automatically removes accidental leading/trailing spaces
        lowercase: true,
        unique: true,
    },
    color: {
        type: String,
        default: '#333333'
    },
    user: {
        type: Schema.Types.ObjectId, // A special MongoDB unique identifier
        ref: 'User', // Links this note directly to a document in the 'User' collection
        required: true
    }
})


// --- MODULE EXPORT -------------------------------------------------------------------------------

module.exports = mongoose.model('Tag', TagSchema)
