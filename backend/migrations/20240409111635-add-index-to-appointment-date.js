'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Appointments', ['date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Appointments', ['date']);
  }
};
