const express = require('express');

const DepartmentController = require('../controllers/departmentController');
const DoctorController = require('../controllers/doctorController');
const AppointmentController = require('../controllers/appointmentController');
const AuthController = require('../controllers/authController');
const DashboardController = require('../controllers/dashboardController');
const authenticateUser = require('../middlewares/authenticateUser');
const optionalAuthenticateUser = require('../middlewares/optionalAuthenticateUser');

const router = express.Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.get('/auth/me', authenticateUser, AuthController.getCurrentUser);

router.get('/dashboard', authenticateUser, DashboardController.getSummary);
router.get('/dashboard/appointments', authenticateUser, DashboardController.getAppointments);
router.patch(
  '/dashboard/appointments/:appointmentId/cancel',
  authenticateUser,
  DashboardController.cancelAppointment
);

router.get('/departments', DepartmentController.getAllDepartments);
router.get('/doctors', DoctorController.getDoctorsByDepartmentQuery);
router.get('/doctors/:doctorId/available-slots', AppointmentController.getAvailableSlots);
router.get('/doctors/department/:departmentId', DoctorController.getDoctorsByDepartment);
router.post('/appointments', optionalAuthenticateUser, AppointmentController.createAppointmentApi);

module.exports = router;
