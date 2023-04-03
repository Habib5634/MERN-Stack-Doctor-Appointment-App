const express = require("express")
const colors = require("colors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const connectDB = require("./Config/db")

//dotenv config
dotenv.config()


//connecction to mongodb    cd ..
connectDB()


//rest object
const app = express()


//middleware
app.use(express.json())
app.use(morgan('dev'))

// /routes
app.use('/api/v1/user', require('./Router/userRuotes'))
app.use('/api/v1/admin', require('./Router/adminRoutes'))
app.use('/api/v1/doctor', require('./Router/doctorRout'))


//routes ye routes humny testing purpose k lea add kea thy
// app.get('/', (req, res) => {
//     res.status(200).send({
//         message: "Server Running    "
//     })
// })
//Port
const port = process.env.PORT || 8080
//listen port
app.listen(port, () => {
    console.log(`Server is Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`.bgCyan.white)
})


