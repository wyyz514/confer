var Sequelize  = require('sequelize');
var encryptor  = require('../helpers/encryptor');

module.exports = function(User) {
	
	function login() {

		//check email and password match in db

		return function (req, res, next) {
			var email    = req.body.email;
			var password = req.body.password;
			 
			 
			User
				.findOne({where: {email: email}})
				.then(
					function(user) {
						var hashedPassword    = user.get('password');
						var isCorrectPassword = encryptor.compare(password, hashedPassword);
						
						if (isCorrectPassword) {
							res.locals.authenticated = true;
						} else {
							res.locals.authenticated = false;
						}
					}
				).then(function(){
					next();
				});
			
		}
	};

	function signup() {

		//check email not used

		return function (req, res, next) {
			var email     = req.body.email;
			var password  = req.body.password;
			var confirm   = req.body.confirm;
			
			User
				.findOrCreate({where: {email: email}, defaults: {password: encryptor.encryptPass(password)}})
				.spread(
					function(user, created) {
						console.log(created);
						if (! created) {
							res.locals.userAlreadyExists = true;
						} else {  
							res.locals.userAlreadyExists = false;
						}
					}
				).then(function(){
					next();
				});
			
		}
	}
	
	return {
		login: login,
		signup: signup
		
	}
}