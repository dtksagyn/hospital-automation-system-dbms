const express = require('express');

const DepartmentController = require('../controllers/departmentController');
const DoctorController = require('../controllers/doctorController');
const AppointmentController = require('../controllers/appointmentController');
const AuthController = require('../controllers/authController');
const DashboardController = require('../controllers/dashboardController');
const DoctorAuthController = require('../controllers/doctorAuthController');
const DoctorDashboardController = require('../controllers/doctorDashboardController');
const authenticateUser = require('../middlewares/authenticateUser');
const authenticateDoctorApi = require('../middlewares/authenticateDoctorApi');
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

router.post('/doctor/auth/login', DoctorAuthController.login);
router.post('/doctor/auth/logout', DoctorAuthController.logout);
router.get('/doctor/auth/me', authenticateDoctorApi, DoctorAuthController.getCurrentDoctor);
router.get('/doctor/dashboard', authenticateDoctorApi, DoctorDashboardController.getSummary);
router.get('/doctor/appointments', authenticateDoctorApi, DoctorDashboardController.getAppointments);
router.get('/doctor/schedule', authenticateDoctorApi, DoctorDashboardController.getSchedule);
router.get('/doctor/patients', authenticateDoctorApi, DoctorDashboardController.getPatients);
router.patch(
  '/doctor/appointments/:appointmentId/visit-status',
  authenticateDoctorApi,
  DoctorDashboardController.updateVisitStatus
);

router.get('/departments', DepartmentController.getAllDepartments);
router.get('/doctors', DoctorController.getDoctorsByDepartmentQuery);
router.get('/doctors/:doctorId/available-slots', AppointmentController.getAvailableSlots);
router.get('/doctors/department/:departmentId', DoctorController.getDoctorsByDepartment);
router.post('/appointments', optionalAuthenticateUser, AppointmentController.createAppointmentApi);

module.exports = router;
