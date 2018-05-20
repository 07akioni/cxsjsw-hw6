'use strict';
module.exports = (sequelize, DataTypes) => {
  var tbDetail = sequelize.define('detail', {
    Oid: {
      type: DataTypes.STRING
    },
    DishId: {
      type: DataTypes.STRING
    },
    DishNum: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'tbDetail'
  });
  tbDetail.associate = function(models) {
    tbDetail.belongsTo(models.order, { foreignKey: 'Oid', targetKey: 'Oid' })
  };
  return tbDetail;
};