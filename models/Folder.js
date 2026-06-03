// --- REQUIRES AND VARIABLES -------------------------------------------------------------------

const { mongoose, Schema } = require('mongoose')


// --- SCHEMA -----------------------------------------------------------------------------------

const FolderSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Automatically removes accidental leading/trailing spaces
        unique: true
    },
    parent: {
        type: String,
        default: '' // Starts empty if not a subfolder
    },
    subfolders: {
        type: [String], 
        default: []
    },
    user: {
        type: Schema.Types.ObjectId, // A special MongoDB unique identifier
        ref: 'User', // Links this note directly to a document in the 'User' collection
        required: true
    },
})


// --- MODULE EXPORT -------------------------------------------------------------------------------

module.exports = mongoose.model('Folder', FolderSchema)
