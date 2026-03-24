import mongoose from 'mongoose'
const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

let isConnected = false
export const dbConnect = async() => {
    mongoose.set('strictQuery', true)

    if (isConnected) return

    const MONGO_URI = process.env.NEXT_PUBLIC_BACKEND_URL
    console.log(MONGO_URI)

    if (!MONGO_URI) throw new Error('Plese define mongo')

        try {
            await mongoose.connect(MONGO_URI, {bufferCommands: false, family: 4})
            isConnected = true
            console.log('db connected')
        } catch(error) {
            console.log(error)
             throw error
        }
}