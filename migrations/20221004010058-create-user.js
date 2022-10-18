'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      division: {
        type: Sequelize.STRING
      },
      team: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      season: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      goal: {
        type: Sequelize.STRING
      },
      decisivePass: {
        type: Sequelize.STRING
      },
      numberOfplayedMatches: {
        type: Sequelize.STRING
      },
      yellowCard: {
        type: Sequelize.STRING
      },
      redCard: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};