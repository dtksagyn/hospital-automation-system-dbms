const { Sequelize } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'mysql',
  username: 'root',
  password: 'Qwerty1.',
  database: 'hospital'
});

module.exports = sequelize;
