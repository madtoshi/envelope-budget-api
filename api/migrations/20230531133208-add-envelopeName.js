'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'envelopeName', Sequelize.STRING);
    await queryInterface.changeColumn('Transactions', 'amountSpent', { allowNull: false })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'envelopeName');
    await queryInterface.changeColumn('Transactions', 'amountSpent', { allowNull: true })
  }
};
