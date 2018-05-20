'use strict';
module.exports = (sequelize, DataTypes) => {
  var tbMulti = sequelize.define('multi', {
    Mid: {
      type: DataTypes.STRING
    },
    Mname: {
      type: DataTypes.STRING
    },
    Mprice: {
      type: DataTypes.DOUBLE
    }
  }, {
    tableName: 'tbMulti'
  });
  tbMulti.associate = function(models) {
    // associations can be defined here
  };
  return tbMulti;
};