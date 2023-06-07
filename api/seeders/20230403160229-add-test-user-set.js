'use strict';

const { query } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.sequelize.query('ALTER SEQUENCE "Users_id_seq" RESTART WITH 1;').then(async () => {
    await queryInterface.bulkInsert('Users', [
      {first: 'Tim', last: 'Saunders', email: 'timmyS@gmail.com', hash: "unsecuredpass"},
      {first: 'Sarah', last: 'Goy', email: 'Sarahbaby@gmail.com', hash: "unsecuredpass"},
      {first: 'Roger', last: 'Beans', email: 'Hoger@gmail.com', hash: "unsecuredpass"},
      {first: 'Sam', last: 'Hyde', email: 'Sammy@gmail.com', hash: "unsecuredpass"},
      {first: 'Zach', last: 'Vemuru', email: 'sonnyV@gmail.com', hash: "unsecuredpass"},
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
    await queryInterface.bulkDelete('Users', null, {
        truncate: true, 
        cascade: true
    })
  }
};
