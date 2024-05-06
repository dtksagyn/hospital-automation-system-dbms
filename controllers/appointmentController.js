const Appointment = require('../models/appointment')
const AppointmentsView = require('../models/appointmentViews');
const Doctor = require('../models/doctor')
const Department = require('../models/department')
const Diagnosis = require('../models/diagnosis')
const qr = require('qrcode');
const cipher = require('../utils/cipher')
const { Op } = require('sequelize');


const AppointmentController = {
    async appointmentPage(req, res){
        res.render('appointments/appointment');
    },
    async getDailyAppointmentByDoctorId(req, res){
        const {doctorId, date} = req.params

        try {
            const appointments = await Appointment.findAll({
                where: {
                    doctorId,
                    date,
                },
                attributes: ['appointmentId', 'time']
            })


            res.json(appointments);
        } catch (error) {
            console.error('Error fetchihng appointments:', error);
            res.status(500).json({ message : "Error fetching appointments"});
        }
    },
    async createAppointment(req, res,next){
        let { doctorId, date, time, firstName,lastName, ssn,departmentId } = req.body;
        ssn = cipher.encryptSSN(ssn);
        req.body.ssn = ssn;
        console.log(req.body)
        try {
            const appointment = await Appointment.create({
                doctorId,
                date,
                time,
                firstName,
                lastName,
                ssn,
                departmentId,
            });
            next();
        } catch (error) {
            console.error('Error creating appointment:', error);
            res.status(500).json({ message: "Error creating appointment" });
        }
        
    },
    async generateQRCode(appointmentId) {
        try {
            // Generate QR code with appointment ID
            const qrCode = await qr.toDataURL(appointmentId);
            return qrCode; // Return the data URL of the QR code image
        } catch (error) {
            console.log('Error generating QR code:', error);
            throw new Error('Error generating QR code');
        }
    },
    async appointmentInfoPage(req, res) {
        let { ssn ,departmentId} = req.body;
    
        if (ssn) {
            try {
                const appointment = await Appointment.findOne({
                    where: { ssn, departmentId },
                    include: [
                        { model: Doctor, attributes: ['firstName', 'lastName'] },
                        { model: Department, attributes: ['departmentName'] }
                    ]
                });
    
                if (!appointment) {
                    return res.status(404).json({ message: "Appointment not found for the provided SSN" });
                }
    
                const qrCode = await AppointmentController.generateQRCode(appointment.appointmentId.toString()); // Generate QR code for the appointment ID
    
                const appointmentDetails = {
                    appointmentId: appointment.appointmentId,
                    date: appointment.date,
                    time: appointment.time,
                    doctorName: `${appointment.Doctor.firstName} ${appointment.Doctor.lastName}`,
                    departmentName: appointment.Department.departmentName,
                    qrcode: qrCode
                };
    
                res.render('appointments/appointment-ticket', { appointment: appointmentDetails });
            } catch (error) {
                console.error('Error fetching appointment details by SSN:', error);
                res.status(500).json({ message: "Error fetching appointment details by SSN" });
            }
        } else {
            res.status(400).json({ message: "SSN is required" });
        }
    },

 

    async appointmentTable(req, res) {
        try {
            const appointments = await AppointmentsView.findAll({ attributes: { exclude: ['id'] } });
            res.render('appointments/appointment-table', { appointments });
        } catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    async appointmentTableId(req,res){
        const departmentName = req.params.departmentName;
        try {
            const appointments = await AppointmentsView.findAll({ attributes: { exclude: ['id'] } , where : {departmentName}});
            res.render('appointments/appointment-table', { appointments });
        } catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).send('Internal Server Error');
        }
        

    }
    
    

    

}

module.exports = AppointmentController;