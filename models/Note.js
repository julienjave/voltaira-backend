// --- REQUIRES AND VARIABLES -------------------------------------------------------------------

const { mongoose, Schema } = require('mongoose')


// --- SCHEMA -----------------------------------------------------------------------------------

const NoteSchema = new Schema({
    title: {
        type: String,
        required: [true, 'A note title is absolutely required'],
        trim: true, // Automatically removes accidental leading/trailing spaces
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        default: '' // Starts empty if they just click "New Note"
    },
    user: {
        type: Schema.Types.ObjectId, // A special MongoDB unique identifier
        ref: 'User', // Links this note directly to a document in the 'User' collection
        required: true
    },
    tags: {
        type: [String], // An array of strings for flexible filtering later
        default: []
    },
    links: [{
        type: Schema.Types.ObjectId,
        ref: 'Note',
    }]
}, {
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' date fields
})


// --- MODULE EXPORT -------------------------------------------------------------------------------

module.exports = mongoose.model('Note', NoteSchema)
