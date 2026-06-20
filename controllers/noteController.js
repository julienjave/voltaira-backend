/*
    Copyright 2026 Julien Javelaud

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/


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

// 2. Get all notes with a specific Tags 
const getAllNotesByTags = async (req, res) => {
    try {
        // 1. Parse the comma-separated string of hex IDs from the query parameters
        const { tags: tagsQuery } = req.query
        if (!tagsQuery) {
            return res.status(400).json({ message: "No tag IDs specified for search" })
        }

        // Split the string directly into an array of ID strings
        const tagIds = tagsQuery.split(',')

        // 2. Query the notes directly
        const notes = await Note.find({
            user: req.user.id,
            tags: { $all: tagIds } // Mongoose automatically casts string hex IDs into ObjectIds
        }).populate('tags')

        res.status(200).json(notes)

    } catch (error) {
        console.error("Backend tag filter error:", error)
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
            { returnDocument: 'after', runValidators: true }
        );
        
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
}

// 2. Add tag atomically
const addTagToNote = async (req, res) => {
    try {
        const { id, tagId } = req.params

        // $addToSet guarantees no duplicate tags can ever be pushed into the array
        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { $addToSet: { tags: tagId } },
            { returnDocument: 'after', runValidators: true }
        ).populate('tags')

        if (!updatedNote) return res.status(404).json({ message: "Note not found" })
        res.status(200).json(updatedNote)
    } catch (error) {
        res.status(500).json({ message: "Failed to add tag to note" })
    }
}

// 3. Remove tag atomically
const removeTagFromNote = async (req, res) => {
    try {
        const { id, tagId } = req.params

        // $pull surgically removes the tagId from the array without touching anything else
        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { $pull: { tags: tagId } },
            { returnDocument: 'after', runValidators: true }
        ).populate('tags')

        if (!updatedNote) return res.status(404).json({ message: "Note not found" })
        res.status(200).json(updatedNote)
    } catch (error) {
        res.status(500).json({ message: "Failed to remove tag from note" })
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
    getAllNotesByTags,
    getOneNote,
    postOneNote,
    patchOneNote,
    addTagToNote,
    removeTagFromNote,
    deleteOneNote,
    deleteAllNotes
}
