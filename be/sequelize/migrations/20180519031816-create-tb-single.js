'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tbSingle', {
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
      Sid: {
        type: Sequelize.STRING
      },
      Sname: {
        type: Sequelize.STRING
      },
      Sprice: {
        type: Sequelize.DOUBLE
      }
    })
    .then(() => {
      return queryInterface.addConstraint('tbSingle', [ 'Sid' ], {
        type: 'unique',
        name: 'tbSingle_Sid_unique'
      })
    })
    .then(() => {
      return queryInterface.addIndex('tbSingle', {
        fields: [ 'Sid' ],
        name: 'tbSingle_Sid_index'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tbSingle');
  }
};