const { loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorController, bookAppointmentController, bookingAvailibilityController, userAppointmentController } = require("../Controller/userController")

const express = require("express")
const authMiddleware = require("../Middleware/authMiddleware")


//routes object
const router = express.Router()

//routes
//Login || Post
router.post('/login', loginController)
//register || post

router.post('/register', registerController)

//Auth || post
router.post('/getUserData', authMiddleware, authController)

//Apply doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController)

//notification Doctor || POST
router.post("/get-all-notification", authMiddleware, getAllNotificationController)

//notification Doctor || POST
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController)

//get all doctors
router.get('/getAllDoctor', authMiddleware, getAllDoctorController)

//bok appointment'
router.post('/book-appointment', authMiddleware, bookAppointmentController)

//Booking Availibility

router.post('/booking-availbility', authMiddleware, bookingAvailibilityController)

//user appointment list get
router.get('/user-appointments', authMiddleware, userAppointmentController)



//export
module.exports = router