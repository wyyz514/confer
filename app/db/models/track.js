'use strict';
module.exports = function(sequelize, DataTypes) {
    var Track = sequelize.define('Track', {
		tid: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
        name: {
			type: DataTypes.STRING,
			allowNull: false
		}//,
		// cid: {
			// type: DataTypes.INTEGER,
			// references: {model: 'conference', key: 'cid'}
		// }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
				//Track.belongsTo(models.Conference, {foreignKey: 'conference_id'})
            }
        }
    });
    return Track;
};