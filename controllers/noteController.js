// Import Mongoose model
const Note = require('../models/Note')
const Tag = require('../models/Tag')


// --- GET ROUTES ----------------------------------------------------------------

// 1. Get all notes for a specific user
const getAllNotes = async (req, res) => {
    try {
        // Passing a filter object: { user: loggedInUserId }
        const notes = await Note.find({ user: req.user.id })
        res.status(200).json(notes)
    } catch (error) {
        res.status(500).json({ message: "Server error retrieving notes" })
    }
}

// 2. Get all notes with a specific Tag / param :tag
const getAllNotesByTag = async (req, res) => {
    try {
        // 1. Parse the tag names from the query string
        // If no tags are provided, default to an empty array
        const { tags: tagsQuery } = req.query
        if (!tagsQuery) {
            return res.status(400).json({ message: "No tags specified for search" })
        }

        // Split the comma-separated string and clean up casing/spaces
        const searchTagNames = tagsQuery.split(',').map(name => name.toLowerCase().trim())

        // 2. Find all matching Tag documents for this specific user
        // We use the MongoDB $in operator to find any tag whose name is in our array
        const matchingTags = await Tag.find({
            name: { $in: searchTagNames },
            user: req.user.id
        })

        // If the database couldn't find ANY of the tags requested, return empty early
        if (matchingTags.length === 0) {
            return res.status(200).json([]);
        }

        // Extract just the ObjectIds from the tags we found
        const tagIds = matchingTags.map(tag => tag._id)

        // 3. Find the notes using the "AND" rule
        // The MongoDB $all operator ensures a note MUST contain EVERY ID in the tagIds array
        const notes = await Note.find({
            user: req.user.id,
            tags: { $all: tagIds } 
        }).populate('tags');

        res.status(200).json(notes)

    } catch (error) {
        res.status(500).json({ message: "Server error retrieving notes" })
    }
}

// 3. Get one note by id (or name) / param :id
const getOneNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
        
        // Security check: Make sure this note actually belongs to the person requesting it
        if (!note || note.user.toString() !== req.user.id) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }
        
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({ message: "Error finding note" })
    }
}


// --- POST ROUTES ----------------------------------------------------------------

// 1. Post one new note
const postOneNote = async (req, res) => {
    try {
        const { title, content, tags, links } = req.body
    
        const newNote = new Note({
            title: title,
            content: content,
            user: req.user.id,
            tags: tags,
            links: links
        })
        
        const savedNote = await newNote.save()
        // Populate the tags immediately before sending back so the frontend gets the full data
        const populatedNote = await savedNote.populate('tags')
    
        res.status(201).json(populatedNote)
    } catch (error) {
        res.status(400).json({ message: "Failed to process note", error: error.message })
    }
}


// --- PATCH ROUTES ---------------------------------------------------------------

// 1. Patch one existing note by id
const patchOneNote = async (req, res) => {
    try {
        // { new: true }: returns the freshly updated document instead of the old version
        // { runValidators: true }: forces the update to respect the Schema rules
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
}


// --- DELETE ROUTES --------------------------------------------------------------

// 1. Delete one note by id
const deleteOneNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Note deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete note" })
    }
}

// 2. Delete all notes for a specific user
const deleteAllNotes = async (req, res) => {
    try {
        await Note.deleteMany( { user: req.user.id})
    } catch (error) {
        res.status(500).json({ message: "Failed to delete notes" })
    }
}



// --- MODULE EXPORT ---------------------------------------------------------------
module.exports = {
    getAllNotes,
    getAllNotesByTag,
    getOneNote,
    postOneNote,
    patchOneNote,
    deleteOneNote,
    deleteAllNotes
}
