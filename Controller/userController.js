const userModel = require("../Models/userModels")
const doctorModel = require("../Models/DoctorModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const appointmentModel = require('../Models/appointmentModel')
const moment = require("moment");
//register controller
const registerController = async (req, res) => {
    try {
        const exixtingUser = await userModel.findOne({ email: req.body.email })
        if (exixtingUser) {
            return res.status(200).send({
                success: false,
                message: "User Already Exist"
            })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body)
        await newUser.save();
        res.status(201).send({
            success: true,
            message: "Registered succesfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: `Register Controlller  ${error.message}`
        })
    }
}
//login controller
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "user not found"
            })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: "Invaled email or password"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.status(200).send({
            success: true,
            message: 'Login Success',
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: `Erroe in Login Controller ${error.message} `
        })
    }
}


//Auth controller got getting login user data
const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined
        if (!user) {
            return res.status(200).send({
                message: "user Not Found",
                success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "auth error",
            error
        })
    }
}

///Apply doctor controller
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'Pending' })
        await newDoctor.save()
        //find admin to recieve request
        const adminUser = await userModel.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has apply for a doctor account`,
            data: {
                dictorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '.admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message: "Doctor account apply successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while apply for doctor",
            error
        })
    }
}

// get all notificaton
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const seenNotification = user.seenNotification
        const notification = user.notification
        seenNotification.push(...notification)
        user.notification = []
        user.seenNotification = notification
        const updateUser = await user.save()
        res.status(200).send({
            success: true,
            message: "all notification marked as read",
            data: updateUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting notification",
            error
        })
    }
}

// delete all notification
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.notification = [];
        user.seennotification = [];
        const updateUser = await user.save()
        updateUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Notification deleted successfully",
            data: updateUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "unable to delete all notification",
            error,
        })
    }
}


///Get all doctor controller
const getAllDoctorController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" }) //mtlb k agr docctor ka status approved hy tabhi doctor show kray
        res.status(200).send({
            success: true,
            message: "Successfully getting al doctors",
            data: doctors
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess: false,
            message: "Error while getting doctors",
            error,
        })
    }
}

//book appointment controller
const bookAppointmentController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status = "pending"
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save()
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId })
        user.notification.push({
            type: "New_appointment-request",
            message: ` A new appointment request from ${req.body.userInfo.name}`,
            onClickPath: "/user/appointments"
        })
        await user.save()
        res.status(200).send({
            success: true,
            message: "Appointment book successsfully"
        })
    } catch (error) {
        console.log(error)
        res.staus(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

//Booking Availibility Coontrolletr
const bookingAvailibilityController = async (req, res) => {
    try {
        const date = moment(req.body.date, `DD-MM-YY`).toISOString()
        const fromTime = moment(req.bosy.time, `HH-mm`).subtract(1, 'hours').toISOString()
        const toTime = moment(req.bosy.time, `HH-mm`).add(1, 'hours').toISOString()
        const doctorId = req.body.doctorId
        const appointments = await appointmentModel.find({
            doctorId, date,
            time: {
                $gte: fromTime, $lte: toTime  //get means grater than eqaual to and let mean lessthan equal to
            }
        })
        if (appointments.length > 0) {
            return res.staus(200).send({
                success: true,
                message: "Appointment not available at this time "
            })
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointment Available"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        })
    }
}

//user Appointment Controller
const userAppointmentController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: "successfully get Appointments",
            data: appointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: falswe,
            message: 'Error while getting appointments',
            error
        })
    }
}

module.exports = { bookingAvailibilityController, userAppointmentController, loginController, bookAppointmentController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorController }