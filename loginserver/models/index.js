'use strict';

const fs        = require('fs');
const path      = require('path');
const nconf     = require('nconf');
const Sequelize = require('sequelize');

const basename  = path.basename(module.filename);

var db        = {};

// load config file and environment variables
nconf.env()
     .file({file: "../config.json"});

// get NODE_ENV environment variable
const ENV = nconf.get("NODE_ENV");

// import database configuration from the config file
  // const config = nconf.get("database:dev");
  // console.log(config);
  // var sequelize = new Sequelize(config.database,
    // config.username, config.password, config.options);
	
  var sequelize = new Sequelize("confer", "root", "minnetian8", {host:"127.0.0.1", dialect:"mysql", 
  port : 3306});

// iter over all js files in current directory and import models
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'); //return only files that are of .js extension, which also have a string before '.', ignore itself
  })
  .forEach(function(file) {
    let model = sequelize['import'](path.join(__dirname, file)); //for each file, import the table at an index in the db structure defined by the name of the table
    db[model.name] = model;
  });

// Make all the associations
Object.keys(db).forEach(function(modelName) { //for each key in the database hash table, where the key is described by the name of a table, make an association
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; //the lower case sequelize represents the new database variable made with the config files details
db.Sequelize = Sequelize; //the larger case Sequelize represents the require above (need to check this)

module.exports = db; //make db a public variable that can be imported