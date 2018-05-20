'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tbMulti', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      Mid: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Mname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Mprice: {
        allowNull: false,
        type: Sequelize.DOUBLE
      }
    })
    .then(() => {
      return queryInterface.addConstraint('tbMulti', [ 'Mid' ], {
        type: 'unique',
        name: 'tbMulti_Mid_unique'
      })
    })
    .then(() => {
      return queryInterface.addIndex('tbMulti', {
        fields: [ 'Mid' ],
        name: 'tbMulti_Mid_index'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tbMulti');
  }
};