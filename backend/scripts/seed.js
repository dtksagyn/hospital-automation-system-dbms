require('dotenv').config();

const bcrypt = require('bcrypt');
const connectDB = require('../utils/db');
const Department = require('../models/department');
const Doctor = require('../models/doctor');
const User = require('../models/user');
const Appointment = require('../models/appointment');
const Diagnosis = require('../models/diagnosis');
const cipher = require('../utils/cipher');

const departments = [
  { departmentName: 'Cardiology' },
  { departmentName: 'Pulmonology' },
  { departmentName: 'Neurology' },
  { departmentName: 'Pediatrics' },
];

const doctors = [
  { firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.mitchell@caremed.com', departmentName: 'Cardiology' },
  { firstName: 'James', lastName: 'Carter', email: 'james.carter@caremed.com', departmentName: 'Pulmonology' },
  { firstName: 'Emily', lastName: 'Brooks', email: 'emily.brooks@caremed.com', departmentName: 'Neurology' },
  { firstName: 'Michael', lastName: 'Turner', email: 'michael.turner@caremed.com', departmentName: 'Pediatrics' },
  { firstName: 'Demo', lastName: 'Doctor', email: 'doctor@caremed.com', departmentName: 'Cardiology' },
];

async function seed() {
  await connectDB();

  await Promise.all([
    Department.deleteMany({}),
    Doctor.deleteMany({}),
    User.deleteMany({}),
    Appointment.deleteMany({}),
    Diagnosis.deleteMany({}),
  ]);

  const createdDepartments = await Department.insertMany(departments);
  const departmentMap = Object.fromEntries(
    createdDepartments.map((department) => [department.departmentName, department._id])
  );

  const createdDoctors = {};
  for (const doctor of doctors) {
    createdDoctors[doctor.email] = await Doctor.create({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      password: bcrypt.hashSync('doctor123', 12),
      departmentId: departmentMap[doctor.departmentName],
    });
  }

  const patient = await User.create({
    fullName: 'Jane Patient',
    email: 'patient@caremed.com',
    password: bcrypt.hashSync('patient123', 12),
  });

  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 5);
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 21);

  const formatDate = (date) => date.toISOString().slice(0, 10);

  const upcomingAppointment = await Appointment.create({
    userId: patient._id,
    firstName: 'Jane',
    lastName: 'Patient',
    phone: '+1 555 010 2000',
    ssn: cipher.encryptSSN('+1 555 010 2000'),
    departmentId: departmentMap.Cardiology,
    doctorId: createdDoctors['sarah.mitchell@caremed.com']._id,
    date: formatDate(futureDate),
    time: '10:30:00',
    status: 'active',
  });

  const completedAppointment = await Appointment.create({
    userId: patient._id,
    firstName: 'Jane',
    lastName: 'Patient',
    phone: '+1 555 010 2000',
    ssn: cipher.encryptSSN('+1 555 010 2000'),
    departmentId: departmentMap.Pulmonology,
    doctorId: createdDoctors['james.carter@caremed.com']._id,
    date: formatDate(pastDate),
    time: '14:00:00',
    status: 'active',
  });

  await Diagnosis.create({
    description: 'Routine follow-up completed with stable results.',
    medication: 'Salbutamol inhaler, 2 puffs as needed',
    appointmentId: completedAppointment._id,
  });

  const demoDoctor = createdDoctors['doctor@caremed.com'];
  const todayStr = formatDate(today);

  const michaelAppointment = await Appointment.create({
    userId: patient._id,
    firstName: 'Michael',
    lastName: 'Jones',
    phone: '+1 555 010 3001',
    ssn: cipher.encryptSSN('+1 555 010 3001'),
    departmentId: departmentMap.Cardiology,
    doctorId: demoDoctor._id,
    date: todayStr,
    time: '09:00:00',
    patientAge: 34,
    appointmentType: 'Follow-up',
    reason: 'Routine blood pressure review',
    visitStatus: 'completed',
    status: 'active',
  });

  await Diagnosis.create({
    description: 'Blood pressure stable. Continue current medication plan.',
    medication: 'Lisinopril 10mg daily',
    appointmentId: michaelAppointment._id,
  });

  await Appointment.create({
    userId: patient._id,
    firstName: 'Sarah',
    lastName: 'Thompson',
    phone: '+1 555 010 3002',
    ssn: cipher.encryptSSN('+1 555 010 3002'),
    departmentId: departmentMap.Cardiology,
    doctorId: demoDoctor._id,
    date: todayStr,
    time: '10:00:00',
    patientAge: 41,
    appointmentType: 'Consultation',
    reason: 'Chest discomfort evaluation',
    visitStatus: 'in_progress',
    status: 'active',
  });

  await Appointment.create({
    userId: patient._id,
    firstName: 'David',
    lastName: 'Chen',
    phone: '+1 555 010 3003',
    ssn: cipher.encryptSSN('+1 555 010 3003'),
    departmentId: departmentMap.Cardiology,
    doctorId: demoDoctor._id,
    date: todayStr,
    time: '11:00:00',
    patientAge: 52,
    appointmentType: 'Check-up',
    reason: 'Annual cardiac screening',
    visitStatus: 'waiting',
    status: 'active',
  });

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  await Appointment.create({
    userId: patient._id,
    firstName: 'Emily',
    lastName: 'Rodriguez',
    phone: '+1 555 010 3004',
    ssn: cipher.encryptSSN('+1 555 010 3004'),
    departmentId: departmentMap.Cardiology,
    doctorId: demoDoctor._id,
    date: tomorrowStr,
    time: '13:00:00',
    patientAge: 29,
    appointmentType: 'Consultation',
    reason: 'Post-surgery follow-up',
    visitStatus: 'scheduled',
    status: 'active',
  });

  console.log('Seed complete.');
  console.log('Departments:', createdDepartments.length);
  console.log('Doctors:', doctors.length);
  console.log('Demo doctor login: doctor@caremed.com / doctor123');
  console.log('Demo patient login: patient@caremed.com / patient123');
  console.log('Upcoming appointment id:', upcomingAppointment._id.toString());

  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
