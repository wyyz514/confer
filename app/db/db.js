var Sequelize = require('sequelize');
;
module.exports = function() {
	var db = {};
	
    db.sequelize = new Sequelize('confer', process.env.CONFER_DB_USERNAME, process.env.CONFER_DB_PASS, {
        host: 'localhost',
        dialect: 'mysql'
    });
    
    db.sequelize
        .authenticate()
        .then(function() {
        console.log('Connection has been established successfully.');
    })
        .catch(function(err) {
        console.error('Unable to connect to the database:', err);
    });
	
	db.User        = require('./models/user')(db.sequelize, Sequelize);
	db.Conference  = require('./models/conference')(db.sequelize, Sequelize);
	db.Track       = require('./models/track')(db.sequelize, Sequelize);
	//db.Privilege   = require('./models/privilege')(db.sequelize, Sequelize);
	
	db.Conference.hasMany(db.Track,   {foreignKey: "cid"});
	db.Track.belongsTo(db.Conference, {foreignKey: "cid"});
	
	
	//this query works, but needs to be implemented
	privilege_table_creation_query = 
		"CREATE TABLE Privilege (privilegeEnum ENUM('admin', 'TPC Chair') NOT NULL," + 
				"uid INTEGER NOT NULL," +
				"cid INTEGER NOT NULL," +
				"tid INTEGER NOT NULL," +
				"CONSTRAINT FK_User FOREIGN KEY (uid) REFERENCES users(id)," +
				"CONSTRAINT FK_Conference FOREIGN KEY (cid) REFERENCES conferences(cid)," + 
				"CONSTRAINT FK_Track FOREIGN KEY (tid) REFERENCES tracks(tid)," +
				"PRIMARY KEY(uid, cid, tid)" + 
				");";
				
	db.sequelize.query(privilege_table_creation_query, { type: db.sequelize.QueryTypes.RAW})
		.then(test => {
		// We don't need spread here, since only the results will be returned for select queries
		console.log(test);
	})
	
    return db;
}