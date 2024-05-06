// models/AppointmentsView.js

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const AppointmentsView = sequelize.define('AppointmentsView', {
    // Define the attributes of the view
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    patientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doctorName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departmentName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false, // Disable timestamps
    tableName: 'appointments_view', // Set the table name to match the view name
    primaryKey: false // Explicitly define the primary key as false
});

module.exports = AppointmentsView;
