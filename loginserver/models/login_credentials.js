'use strict';
// the login dtable model
module.exports = function(sequelize, DataTypes) {
  var Login = sequelize.define('login_credentials', {
    email_address: {type: DataTypes.STRING, allowNull: false},
    hashed_password: {type: DataTypes.STRING, allowNull: false},
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Login
};