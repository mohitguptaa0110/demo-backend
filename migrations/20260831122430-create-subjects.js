'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subjects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'courses',
          key: 'id',
        },

        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },

      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      subjectName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      credits: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('subjects', ['courseId']);

    await queryInterface.addIndex('subjects', ['courseId', 'year']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subjects');
  },
};