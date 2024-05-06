const Doctor = require('../models/doctor');
const Diagnosis = require('../models/diagnosis')
const Appointment = require('../models/appointment')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cipher = require('../utils/cipher')

const Department = require('../models/department');
const AppointmentController = require('./appointmentController');


const DoctorController = {
  async getAllDoctors(req, res) {
    try {
      const doctors = await Doctor.findAll();
      res.status(200).send(doctors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getDoctorsByDepartment(req, res) {
    const departmentId = req.params.departmentId;
  
    try {
      // Query the database for doctors belonging to the specified department
      const doctors = await Doctor.findAll({ where: { departmentId } });
  
      res.json(doctors); // Return the list of doctors
    } catch (error) {
      console.error('Error fetching doctors by department:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async createDoctor(req, res,next) {
    try {
      const { firstName, lastName, departmentId, email, password } = req.body;
      const hashed_password = bcrypt.hashSync(password,12);
      const doctor = await Doctor.create({ firstName, lastName, departmentId, email, password:hashed_password });
      res.status(201).json(doctor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async loginDoctor(req, res) {
    try {
        
        const { email, password } = req.body;

        const doctor = await Doctor.findOne({ where: { email} });
        
        if (doctor && bcrypt.compareSync(password, doctor.password)) {
        // Dont forget to put secret key into env file
        const token = jwt.sign({doctorId: doctor.doctorId},'secretkey',{expiresIn: '1h'});

        res.cookie('token',token, {
            signed: true,
        });

        res.status(200).redirect('/doctors/dashboard');
        //res.redirect('/doctors/info');
        } else {

            // Maybe we can use session based errors.
            const errorMessage = 'Invalid email or password';
            res.render('doctors/doctor_login', { errorMessage });
            //res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async loginPage(req,res) {
    res.render('doctors/doctor_login', {errorMessage: ''});
  },
  // Params
  async getDoctorProfile(req, res) {
    try {
        const doctorId = req.params.doctorId;
        const doctor = await Doctor.findOne({ 

            where: { doctorId }, 
            include: {
                model : Department,
                attributes: ['name'],
        }});
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      const { firstName, lastName, email } = doctor;
      const departmentName = doctor.Department ? doctor.Department.name : 'N/A';
      


      res.render('doctors/doctor_profile',{doctor})
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  async dashboardPage(req,res){
    const message = req.params.message
    const doctorId = req.doctor.doctorId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
        // Fetch the doctor's appointments including related models (Doctor, Department, Diagnosis)
        const appointments = await Appointment.findAll({
            where: { doctorId, date: today },
            include: [
                { model: Doctor, attributes: ['firstName', 'lastName'] },
                { model: Department, attributes: ['departmentName'] },
                { model: Diagnosis } // Include Diagnosis model
            ],
            order: [
                ['date', 'ASC'],
                ['time', 'ASC']
            ]
        });
    
        // Filter out appointments with existing diagnoses
        const filteredAppointments = appointments.filter(appointment => !appointment.Diagnosis);
    
        res.render('doctors/doctor_dashboard', { appointments: filteredAppointments, message});
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).send('Internal Server Error');
    }
    
  },
  async diagnosisPage(req,res){
    const appointmentId = req.params.appointmentId
    
    const doctor = req.doctor
    
    const appointment = await Appointment.findOne({
      where : {appointmentId}
    })

    if(appointment.doctorId !== doctor.doctorId){
      return res.send("You are not authorized for this patient");
    }

    res.render('doctors/diagnosis',{appointment: appointment});
  },
  async createDiagnosis(req, res, next) {
    try {
        // Assuming you have a Diagnosis model imported
        const { description, medication, appointmentId } = req.body;

        // Check if appointmentId exists
        if (!appointmentId) {
            return res.status(400).json({ message: "Appointment ID is required" });
        }

        // Here you can add further validation or checks as needed

        // Create a new diagnosis
        const newDiagnosis = await Diagnosis.create({
            description,
            medication,
            appointmentId
        });

        // Assuming you want to send a success response with the created diagnosis
        req.diagnosis = newDiagnosis
        next()

    } catch (error) {
        console.error('Error creating diagnosis:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async diagnosisTicket(req,res){
    const { description, medication, appointmentId } = req.body;
    const diagnosis = req.diagnosis;

    let appointment = await Appointment.findOne({
      where: {appointmentId},
      include: [
        { model: Doctor, attributes: ['firstName', 'lastName'] },
        { model: Department, attributes: ['departmentName'] },
      ]
    })


    appointment.ssn = cipher.decryptSSN(appointment.ssn)

    diagnosis.qrcode = await AppointmentController.generateQRCode(diagnosis.diagnosisId.toString())

    


    res.render('doctors/diagnosis-ticket',{diagnosis,appointment});
  }

};

module.exports = DoctorController;
