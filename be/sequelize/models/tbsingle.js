'use strict';
module.exports = (sequelize, DataTypes) => {
  var tbSingle = sequelize.define('single', {
    Sid: {
      type: DataTypes.STRING
    },
    Sname: {
      type: DataTypes.STRING
    },
    Sprice: {
      type: DataTypes.DOUBLE
    }
  }, {
    tableName: 'tbSingle'
  });
  tbSingle.associate = function(models) {
    // associations can be defined here
  };
  return tbSingle;
};