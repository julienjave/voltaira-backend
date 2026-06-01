// Import Mongoose model
const Note = require('../models/Note')


// --- GET ROUTES ----------------------------------------------------------------

// 1. Get all notes for a specific user
const getAllNotes = async (req, res) => {

}

// 2. Get all notes with a specific Tag
const getAllNotesByTag = async (req, res) => {

}

// 3. Get one note by id (or name)
const getOneNote = async (req, res) => {

}


// --- POST ROUTES ----------------------------------------------------------------

// 1. Post one new note
const postOneNote = async (req, res) => {

}


// --- PATCH ROUTES ---------------------------------------------------------------

// 1. Patch one existing note by id
const patchOneNote = async (req, res) => {

}


// --- DELETE ROUTES --------------------------------------------------------------

// 1. Delete one note by id
const deleteOneNote = async (req, res) => {

}

// 2. Delete all notes for a specific user
const deleteAllNotes = async (req, res) => {

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
