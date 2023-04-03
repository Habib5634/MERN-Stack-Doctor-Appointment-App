


const appointmentModel = require('../Models/appointmentModel')
const doctorModel = require('../Models/DoctorModel')
const userModel = require('../Models/userModels')
///get single doctor info controller
const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: "Doctor data success true ",
            data: doctor

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fetching doctor data"
        })
    }
}

///Update doctor profile controller
const updateprofileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
        res.status(201).send({
            success: true,
            message: "Doctor Profile Updated",
            data: doctor,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Doctotr Profile Updated issue",
            error
        })
    }
}


//get Doctor by id controller
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId })
        res.status(200).send({
            success: true,
            message: "Successfully get doctor info",
            data: doctor
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting doctor",
            error
        })
    }
}

//get doctor appointments controller
const doctorAppointmentController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        const appointments = await appointmentModel.find({ doctorId: doctor._id })
        res.status(200).send({
            success: true,
            message: "Doctor appointment fetched successfully",
            data: appointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting apointments",
            error
        })
    }
}
///Update status controller
const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, { status })
        const user = await userModel.findOne({ _id: appointments.userId })
        const notification = user.notification
        notification.push({
            type: "Status-updated",
            message: `Your appointment status has been updated ${status}`,
            onClickPath: "doctor-appointments"
        })
        await user.save()
        res.status(200).send({
            success: true,
            message: "Appointment status updated"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            succcess: false,
            message: "Error while Updating the Status",
            error
        })
    }
}

module.exports = { getDoctorInfoController, updateprofileController, getDoctorByIdController, doctorAppointmentController, updateStatusController }






