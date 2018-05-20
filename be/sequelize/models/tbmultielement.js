'use strict';
module.exports = (sequelize, DataTypes) => {
  var tbMultiElement = sequelize.define('multiElement', {
    Mid: {
      type: DataTypes.STRING
    },
    Sid: {
      type: DataTypes.STRING
    },
    Snum: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'tbMultiElement'
  });
  tbMultiElement.associate = function(models) {
    tbMultiElement.belongsTo(models.multi, { foreignKey: 'Mid', targetKey: 'Mid' })
    // tbMultiElement.hasOne(models.single, { foreignKey: 'Sid', sourceKey: 'Sid' })
  };
  return tbMultiElement;
};