'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.sequelize.query('ALTER SEQUENCE "Envelopes_id_seq" RESTART WITH 1;').then(async () => {
      await queryInterface.bulkInsert('Envelopes', [{
         name: 'rent',
         monthlyBudget: '350',
         budgetRemaing: '350',
         userId: 1
      },
      {
         name: 'car',
         monthlyBudget: '450',
         budgetRemaing: '450',
         userId: 1
      },
      {
         name: 'food',
         monthlyBudget: '650',
         budgetRemaing: '650',
         userId: 1
      },
      {
         name: 'rent',
         monthlyBudget: '700',
         budgetRemaing: '700',
         userId: 2
      },
      {
         name: 'car',
         monthlyBudget: '300',
         budgetRemaing: '300',
         userId: 2
      },
      {
         name: 'food',
         monthlyBudget: '250',
         budgetRemaing: '250',
         userId: 2
      },
     ])
   })
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Envelopes', null, {})
  }
};
