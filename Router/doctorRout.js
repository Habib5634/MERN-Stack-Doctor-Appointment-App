const express = require("express")
const { getDoctorInfoController, updateprofileController, getDoctorByIdController, doctorAppointmentController, updateStatusController } = require("../Controller/doctorController")

const authMiddleware = require("../Middleware/authMiddleware")

const router = express.Router()


//POST single doctor
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController)

//POST update doctor profile
router.post('/updateProfile', authMiddleware, updateprofileController)

//POST  get single doctor info
router.post('/getDoctorById', authMiddleware, getDoctorByIdController)

//get Appointments recieved appointments
router.get('/doctor-appointments', authMiddleware, doctorAppointmentController)

//upddate status POST
router.post('/update-status', authMiddleware, updateStatusController)

module.exports = router
