// department.js

const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Department = sequelize.define('Department', {
  departmentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: {
    type: DataTypes.STRING,
    allowNull: false
  }
},{
  timestamps: false,
}
);

module.exports = Department;
