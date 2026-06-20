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


/**
 * DNS Fix for Local Development:
 * Some local network environments (and certain VPNs) struggle to resolve MongoDB Atlas SRV records.
 * This block forces Node to use a reliable DNS provider locally without affecting production networking.
 */
if (process.env.NODE_ENV !== 'production') {
    const dns = require('node:dns/promises')
    dns.setServers(["1.1.1.1", "8.8.8.8"]) 
}
// -----------------------------------------------------------------------------------------------------------


// --- REQUIRES AND VARIABLES ---------------------------------------------------------------------------------
const mongoose = require('mongoose')
require('dotenv').config()

const uri = process.env.MONGO_URI


// --- CONNECTION ---------------------------------------------------------------------------------------------
const connectDB = async () => {
    try {
        // Mongoose connects globally to the cluster
        const conn = await mongoose.connect(uri, {
            // Explicitly tell Mongoose which database inside the cluster to target
            dbName: process.env.MONGO_DB_NAME
        })
        
        console.log(`Mongoose Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Database connection error: ${error.message}`)
        // Exit backend process with failure if database connection fails
        process.exit(1); 
    }
}


// --- MODULE EXPORT -------------------------------------------------------------------------------------------
module.exports = { connectDB }
