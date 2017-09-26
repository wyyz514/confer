var Sequelize = require('sequelize');

module.exports = function() {
    var sequelize = new Sequelize('confer', 'root', 'root', {
        host: 'localhost',
        dialect: 'mysql'
    });
    
    sequelize
        .authenticate()
        .then(function() {
        console.log('Connection has been established successfully.');
    })
        .catch(function(err) {
        console.error('Unable to connect to the database:', err);
    });

    return sequelize;
}