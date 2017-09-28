'use strict';
module.exports = function(sequelize, DataTypes) {
    var Privilege = sequelize.define('Privilege', {
		
        privilege_enum: {
			type: DataTypes.ENUM('admin', 'TPC Chair'),
			allowNull: false
		}
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
				//Track.belongsTo(models.Conference, {foreignKey: 'conference_id'})
            }
        }
    });
    return Privilege;
};