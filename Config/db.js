const mongoose = require("mongoose")
const colors = require("colors")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Mongodb is connected ${mongoose.connection.host}`.bgGreen.white)
    } catch (error) {
        console.log(`Mongo Server Issue ${error}`.bgRed.white)
    }
}


module.exports = connectDB;

