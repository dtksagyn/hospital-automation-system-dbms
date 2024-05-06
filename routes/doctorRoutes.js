const express = require('express');
const router = express.Router();

const DoctorController = require('../controllers/doctorController');
const authenticate = require('../middlewares/authenticate');


router.post('/login', DoctorController.loginDoctor);
router.get('/login', DoctorController.loginPage);

router.get('/department/:departmentId',DoctorController.getDoctorsByDepartment)
router.get('/dashboard/:message?',authenticate,DoctorController.dashboardPage);


router.get('/diagnosis/:appointmentId',authenticate,DoctorController.diagnosisPage);
router.post('/diagnosis',authenticate,DoctorController.createDiagnosis,DoctorController.diagnosisTicket)

// These are endpoints created for development, remove before submit
router.get('/', DoctorController.getAllDoctors);
router.post('/', DoctorController.createDoctor,);
router.get('/profile/:doctorId', DoctorController.getDoctorProfile);


module.exports = router;
