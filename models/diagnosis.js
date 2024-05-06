// models/Diagnosis.js

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Diagnosis = sequelize.define('Diagnosis', {
    diagnosisId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.TEXT, // Use TEXT type for longer descriptions
        allowNull: true // Allow null values for description
    },
    medication: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false // Disable timestamps
});

module.exports = Diagnosis;
