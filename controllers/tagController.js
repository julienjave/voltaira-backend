// Import Mongoose model
const Tag = require('../models/Tag')


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
            { new: true, runValidators: true }
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

        res.status(200).json({ message: "Tag deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete tag" })
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
