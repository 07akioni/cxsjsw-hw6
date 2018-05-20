'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tbMultiElement', {
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
      Sid: {
        allowNull: false,
        type: Sequelize.STRING
      },
      Snum: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    })
    .then(() => {
      return queryInterface.addIndex('tbMultiElement', {
        fields: [ 'Mid' ],
        name: 'tbMultiElement_Mid_index'
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tbMultiElement');
  }
};