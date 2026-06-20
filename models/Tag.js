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
