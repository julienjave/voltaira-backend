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

// REQUIRES AND VARIABLES
const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()
const uri = process.env.MONGO_URI

let dbConnection

// MODULE EXPORT
module.exports = {
    connectToServer: async () => {
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        })

        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect()
            // Send a ping to confirm a successful connection
            await client.db(process.env.MONGO_DB_NAME).command({ ping: 1 })
            console.log("Pinged your deployment. You successfully connected to MongoDB!")
        } finally {
            dbConnection = client.db(process.env.MONGO_DB_NAME)
        }
    },
    getDb: () => {
        if (!dbConnection) {
            throw new Error("DB not initialized. Call connectToServer first.")
        }
        return dbConnection
    }
}
