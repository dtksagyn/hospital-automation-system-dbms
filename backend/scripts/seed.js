require('dotenv').config();

const bcrypt = require('bcrypt');
const connectDB = require('../utils/db');
const Department = require('../models/department');
const Doctor = require('../models/doctor');

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

  await Promise.all([Department.deleteMany({}), Doctor.deleteMany({})]);

  const createdDepartments = await Department.insertMany(departments);
  const departmentMap = Object.fromEntries(
    createdDepartments.map((department) => [department.departmentName, department._id])
  );

  for (const doctor of doctors) {
    await Doctor.create({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      password: bcrypt.hashSync('doctor123', 12),
      departmentId: departmentMap[doctor.departmentName],
    });
  }

  console.log('Seed complete.');
  console.log('Departments:', createdDepartments.length);
  console.log('Doctors:', doctors.length);
  console.log('Demo doctor login: doctor@caremed.com / doctor123');

  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
