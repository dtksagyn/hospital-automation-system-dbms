const express = require('express');

const DepartmentController = require('../controllers/departmentController');
const DoctorController = require('../controllers/doctorController');
const AppointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.get('/departments', DepartmentController.getAllDepartments);
router.get('/doctors', DoctorController.getDoctorsByDepartmentQuery);
router.get('/doctors/:doctorId/available-slots', AppointmentController.getAvailableSlots);
router.get('/doctors/department/:departmentId', DoctorController.getDoctorsByDepartment);
router.post('/appointments', AppointmentController.createAppointmentApi);

module.exports = router;
