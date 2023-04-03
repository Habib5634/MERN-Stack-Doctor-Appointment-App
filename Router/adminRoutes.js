const express = require("express")
const { getAllUserController, getAllDoctorsController, changeAccountStatusController } = require("../Controller/adminController")
const authMiddleware = require("../Middleware/authMiddleware")

const router = express.Router()


// get user || Users
router.get('/getAllUsers', authMiddleware, getAllUserController)
/// get method || doctors'
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController)
//POST account status
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController)


module.exports = router

