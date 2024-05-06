const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Department = require('./department')

const Doctor = sequelize.define('Doctor', {
  doctorId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add departmentId foreign key
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Departments',
      key: 'id'
    }
  }
}, {timestamps : false});

Doctor.belongsTo(Department, {
  foreignKey: {
    name: 'departmentId',
    allowNull: false
  }
});

module.exports = Doctor;
