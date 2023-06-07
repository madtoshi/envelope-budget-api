'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      },
      envelopeName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amountSpent: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE
      },
      envelopeId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Envelopes'
          },
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      notes: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};