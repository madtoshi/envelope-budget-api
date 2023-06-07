'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Envelopes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      monthlyBudget: {
        type: Sequelize.INTEGER
      },
      budgetRemaing: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      }
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Envelopes');
  }
};