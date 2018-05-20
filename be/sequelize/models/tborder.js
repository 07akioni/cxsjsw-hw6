'use strict';
module.exports = (sequelize, DataTypes) => {
  var tbOrder = sequelize.define('order', {
    Oid: {
      type: DataTypes.STRING
    },
    OrigCost: {
      type: DataTypes.DOUBLE
    },
    AcytCost: {
      type: DataTypes.DOUBLE
    }
  }, {
    tableName: 'tbOrder'
  });
  tbOrder.associate = function(models) {
    tbOrder.hasMany(models.detail, { foreignKey: 'Oid', sourceKey: 'Oid' })
  };
  return tbOrder;
};