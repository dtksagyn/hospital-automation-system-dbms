// models/appointment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Department = require('./department');
const Doctor = require('./doctor');
const Diagnosis = require('./diagnosis');

const Appointment = sequelize.define('Appointment', {
  appointmentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ssn: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
}, {
  timestamps: false // Disable timestamps
});

// Define associations
Appointment.belongsTo(Department, { foreignKey: 'departmentId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

Appointment.hasOne(Diagnosis, { foreignKey: 'appointmentId' });
Diagnosis.belongsTo(Appointment, { foreignKey: 'appointmentId' });

module.exports = Appointment;
