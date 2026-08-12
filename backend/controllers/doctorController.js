const Doctor = require('../models/doctor');
const Diagnosis = require('../models/diagnosis');
const Appointment = require('../models/appointment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cipher = require('../utils/cipher');
const Department = require('../models/department');
const AppointmentController = require('./appointmentController');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const DoctorController = {
  async getAllDoctors(req, res) {
    try {
      const doctors = await Doctor.find().populate('departmentId', 'departmentName');
      res.status(200).json(doctors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getDoctorsByDepartment(req, res) {
    try {
      const doctors = await Doctor.find({ departmentId: req.params.departmentId }).select(
        'firstName lastName email departmentId'
      );
      res.json(doctors);
    } catch (error) {
      console.error('Error fetching doctors by department:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getDoctorsByDepartmentQuery(req, res) {
    const { departmentId } = req.query;

    if (!departmentId) {
      return res.status(400).json({ message: 'departmentId is required.' });
    }

    try {
      const doctors = await Doctor.find({ departmentId }).select(
        'firstName lastName email departmentId'
      );
      res.json(doctors);
    } catch (error) {
      console.error('Error fetching doctors by department:', error);
      res.status(500).json({ message: 'Error fetching doctors.' });
    }
  },

  async createDoctor(req, res) {
    try {
      const { firstName, lastName, departmentId, email, password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 12);
      const doctor = await Doctor.create({
        firstName,
        lastName,
        departmentId,
        email,
        password: hashedPassword,
      });
      res.status(201).json(doctor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async loginDoctor(req, res) {
    try {
      const { email, password } = req.body;
      const doctor = await Doctor.findOne({ email });

      if (doctor && bcrypt.compareSync(password, doctor.password)) {
        const token = jwt.sign({ doctorId: doctor._id.toString() }, JWT_SECRET, {
          expiresIn: '1h',
        });

        res.cookie('token', token, { signed: true, httpOnly: true });

        res.status(200).redirect('/doctors/dashboard');
      } else {
        res.render('doctors/doctor_login', { errorMessage: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async loginPage(req, res) {
    res.render('doctors/doctor_login', { errorMessage: '' });
  },

  async getDoctorProfile(req, res) {
    try {
      const doctor = await Doctor.findById(req.params.doctorId).populate(
        'departmentId',
        'departmentName'
      );

      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      res.render('doctors/doctor_profile', { doctor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async dashboardPage(req, res) {
    const message = req.params.message;
    const doctorId = req.doctor._id;
    const today = new Date().toISOString().slice(0, 10);

    try {
      const appointments = await Appointment.find({ doctorId, date: today }).sort({
        time: 1,
      });

      const appointmentIds = appointments.map((a) => a._id);
      const diagnoses = await Diagnosis.find({ appointmentId: { $in: appointmentIds } });
      const diagnosedIds = new Set(diagnoses.map((d) => d.appointmentId.toString()));

      const filteredAppointments = appointments.filter(
        (appointment) => !diagnosedIds.has(appointment._id.toString())
      );

      res.render('doctors/doctor_dashboard', {
        appointments: filteredAppointments,
        message,
      });
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  async diagnosisPage(req, res) {
    try {
      const appointment = await Appointment.findById(req.params.appointmentId);

      if (!appointment) {
        return res.status(404).send('Appointment not found');
      }

      if (appointment.doctorId.toString() !== req.doctor._id.toString()) {
        return res.status(403).send('You are not authorized for this patient');
      }

      res.render('doctors/diagnosis', { appointment });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  async createDiagnosis(req, res, next) {
    try {
      const { description, medication, appointmentId } = req.body;

      if (!appointmentId) {
        return res.status(400).json({ message: 'Appointment ID is required' });
      }

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment || appointment.doctorId.toString() !== req.doctor._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const newDiagnosis = await Diagnosis.create({
        description,
        medication,
        appointmentId,
      });

      req.diagnosis = newDiagnosis;
      next();
    } catch (error) {
      console.error('Error creating diagnosis:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async diagnosisTicket(req, res) {
    try {
      const diagnosis = req.diagnosis;

      const appointment = await Appointment.findById(diagnosis.appointmentId)
        .populate('doctorId', 'firstName lastName')
        .populate('departmentId', 'departmentName');

      appointment.ssn = cipher.decryptSSN(appointment.ssn);
      diagnosis.qrcode = await AppointmentController.generateQRCode(diagnosis._id.toString());

      res.render('doctors/diagnosis-ticket', { diagnosis, appointment });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = DoctorController;
