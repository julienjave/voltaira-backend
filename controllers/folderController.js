// Import Mongoose model
const Folder = require('../models/Folder')


// --- GET ROUTES ----------------------------------------------------------------

// 1. Get all folders
const getAllFolders = async (req, res) => {
    try {
        const folders = await Folder.find({ user: req.user.id })
        res.status(200).json(folders)
    } catch (error) {
        res.status(500).json({ message: "Server error retrieving folders" })
    }
}

// 2. Get one folder by id
const getOneFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id)
        
        res.status(200).json(folder)
    } catch (error) {
        res.status(500).json({ message: "Error finding folder" })
    }
}


// --- POST ROUTES ----------------------------------------------------------------

// 1. Post one new folder
const postOneFolder = async (req, res) => {
    try {
        const { name, parent, subfolders } = req.body
    
        const newFolder = new Folder({
            name: name,
            parent: parent,
            subfolders: subfolders,
            user: req.user.id
        })
        
        const savedFolder = await newFolder.save()
    
        res.status(201).json(savedFolder)
    } catch (error) {
        res.status(400).json({ message: "Failed to create folder", error: error.message })
    }
}


// --- PATCH ROUTES ---------------------------------------------------------------

// 1. Patch one existing folder by id
const patchOneFolder = async (req, res) => {
    try {
        // { new: true }: returns the freshly updated document instead of the old version
        // { runValidators: true }: forces the update to respect the Schema rules
        const updatedFolder = await Folder.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedFolder);
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
}


// --- DELETE ROUTES --------------------------------------------------------------

// 1. Delete one folder by id
const deleteOneFolder = async (req, res) => {
    try {
        await Folder.findByIdAndDelete(req.params.id)

        res.status(200).json({ message: "Folder deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete folder" })
    }
}



// --- MODULE EXPORT ---------------------------------------------------------------
module.exports = {
    getAllFolders,
    getOneFolder,
    postOneFolder,
    patchOneFolder,
    deleteOneFolder,
}
