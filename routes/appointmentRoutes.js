// routes/appointments.js

const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');
// GET route to render appointment creation page

router.get('/', AppointmentController.appointmentPage);

// Route to render the appointment.ejs page
router.get('/appointments', (req, res) => {
    res.render('appointments');
});





// POST route to handle form submission for creating appointments
router.post('/', AppointmentController.createAppointment,AppointmentController.appointmentInfoPage);

router.get('/table',AppointmentController.appointmentTable)
router.get('/table/:departmentName',AppointmentController.appointmentTableId)

// dev_test
router.get('/:doctorId&:date' , AppointmentController.getDailyAppointmentByDoctorId)


module.exports = router;
