'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tbDetail', {
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
      DishId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      DishNum: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    })
    .then(() => {
      return queryInterface.addIndex('tbDetail', {
        fields: [ 'Oid' ],
        name: 'tbDetail_Oid_index'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tbDetail');
  }
};