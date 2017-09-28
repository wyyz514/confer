'use strict';
module.exports = function(sequelize, DataTypes) {
    var Conference = sequelize.define('Conference', {
		cid: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
        name: {
			type: DataTypes.STRING,
			allowNull: false
		},
        startDate: {
			type: DataTypes.DATE,
			allowNull: false
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: false
		},
		reviewForm: {
			type: DataTypes.JSON
		}
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
				//Conference.hasMany(models.Track, {foreignKey: 'conference_id'})
            }
        }
    });
    return Conference;
};