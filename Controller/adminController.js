const doctorModel = require('../Models/DoctorModel')
const userModel = require('../Models/userModels')

//get all user controller
const getAllUserController = async (req, res) => {
    try {
        const users = await userModel.find({})
        res.status(200).send({
            success: true,
            message: "Users List Data",
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting users data",
            error
        })
    }
}


// get all admin controller
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        res.status(200).send({
            success: true,
            message: "Doctors List Data",
            data: doctors
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting doctors data",
            error
        })
    }
}


///Change account status controller
const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status })
        const user = await userModel.findOne({ _id: doctor.userId })
        const notification = user.notification
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your doctor account request has ${status}`,
            onClickPath: '/notification'
        })
        user.isDoctor = status === 'approved' ? true : false
        await user.save()
        res.status(200).send({
            success: true,
            message: "Account status updated",
            data: doctor
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error whilechanging the account status",
            error,
        })
    }
}


module.exports = { getAllDoctorsController, getAllUserController, changeAccountStatusController }