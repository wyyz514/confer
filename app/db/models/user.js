'use strict';
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        email: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            set: function(value) {
                this.setDataValue('password', value);
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return User;
};