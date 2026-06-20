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


// --- REQUIRES AND VARIABLES -------------------------------------------------------------------

const { mongoose, Schema } = require('mongoose')


// --- SCHEMA -----------------------------------------------------------------------------------

const NoteSchema = new Schema({
    title: {
        type: String,
        required: [true, 'A note title is absolutely required'],
        trim: true, // Automatically removes accidental leading/trailing spaces
        maxlength: [100, 'Title cannot be more than 100 characters'],
        default: 'Untitled'
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
