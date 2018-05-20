'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tbOrder', {
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
      Oid: {
        allowNull: false,
        type: Sequelize.STRING
      },
      OrigCost: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      AcytCost: {
        allowNull: false,
        type: Sequelize.DOUBLE
      }
    })
    .then(() => {
      return queryInterface.addConstraint('tbOrder', [ 'Oid' ], {
        type: 'unique',
        name: 'tbOrder_Oid_unique'
      })
    })
    .then(() => {
      return queryInterface.addIndex('tbOrder', {
        fields: [ 'Oid' ],
        name: 'tbOrder_Oid_index'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tbOrder');
  }
};