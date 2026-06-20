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
const Tag = require('../models/Tag')
const Note = require('../models/Note')


// --- GET ROUTES ----------------------------------------------------------------

// 1. Get all tags
const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find({ user: req.user.id })
        res.status(200).json(tags)
    } catch (error) {
        res.status(500).json({ message: "Server error retrieving tags" })
    }
}

// 2. Get one tag by id
const getOneTag = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id)
        
        res.status(200).json(tag)
    } catch (error) {
        res.status(500).json({ message: "Error finding tag" })
    }
}


// --- POST ROUTES ----------------------------------------------------------------

// 1. Post one new tag
const postOneTag = async (req, res) => {
    try {
        const { name, color } = req.body
    
        const newTag = new Tag({
            name: name,
            color: color,
            user: req.user.id
        })
        
        const savedTag = await newTag.save()
    
        res.status(201).json(savedTag)
    } catch (error) {
        res.status(400).json({ message: "Failed to create tag", error: error.message })
    }
}


// --- PATCH ROUTES ---------------------------------------------------------------

// 1. Patch one existing tag by id
const patchOneTag = async (req, res) => {
    try {
        // { new: true }: returns the freshly updated document instead of the old version
        // { runValidators: true }: forces the update to respect the Schema rules
        const updatedTag = await Tag.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { returnDocument: 'after', runValidators: true }
        );
        
        res.status(200).json(updatedTag);
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
}


// --- DELETE ROUTES --------------------------------------------------------------

// 1. Delete one tag by id
const deleteOneTag = async (req, res) => {
    try {
        await Tag.findByIdAndDelete(req.params.id)

        // Automatically strip this tag ID out of EVERY note across the user's vault instantly
        await Note.updateMany(
            { tags: req.params.id },
            { $pull: { tags: req.params.id } }
        )

        res.status(200).json({ message: "Tag deleted successfully" })
    } catch (error) {
        // res.status(500).json({ message: "Failed to delete tag" })
        // 🎯 UNMASK THE BUG: Print the exact line and message that failed in your terminal
        console.error("CRITICAL BACKEND DELETION ERROR:", error);
        
        // Send the real error message back to the frontend console
        res.status(500).json({ 
            message: "Failed to delete tag", 
            developerError: error.message,
            errorStack: error.stack 
        })
    }
}



// --- MODULE EXPORT ---------------------------------------------------------------
module.exports = {
    getAllTags,
    getOneTag,
    postOneTag,
    patchOneTag,
    deleteOneTag,
}
