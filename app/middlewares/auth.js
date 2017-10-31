//THIS IS THE MIDDLEWARE FILE. ONLY LOGIC. ONLY. ALL OTHER STUFF IN ROUTES 
var encryptor  = require('../helpers/encryptor');

module.exports = function(User) {
	
	function login() {

		//check email and password match in db

		return function (req, res, next) {
			var email    = req.body.email;
			var password = req.body.password;
			 
			 
			User
				.findOne({email: email}, function(err, obj) {
					
					if(!err) {
						if (! obj) {
							console.log('User not found');
							res.locals.authenticated = false;
						}
						else {
							var savedPassword = obj.password;
							var isCorrectPassword = encryptor.compare(password, savedPassword);
						
							if(isCorrectPassword) {
								res.locals.authenticated = true;
								res.locals.authenticatedEmail = email;
							} 
							else {
								console.log('Incorrect password');
								res.locals.authenticated = false;
							}
						}
					}
					else {
						console.log("login error", err);
						res.locals.err = err;
					}
					
				}).then(function(){
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
			
			console.log(email, password);
			//compare password and confirm
			User.find({email: email}, function(err,obj) { 
				console.log(err,'\n',obj);
				if(obj.length == 0 && !err) {
					User.create({email: email, password: encryptor.encryptPass(password)}, function(err, obj) {
						if(obj) {
							console.log('User created', JSON.stringify(obj, null, 2));
						}
						
						if (err) {
							console.log('User was not found and was not created!')
							res.redirect('/auth/signup');
						}
					});
				}
				else if (obj.length > 0) {
					console.log("User already exists", JSON.stringify(obj));
					res.locals.userAlreadyExists = true;
				} 
				else {
					res.locals.err = err;
				}
			}).then(function(){
				console.log("in then");
				next();
			});
			
		}
	}
	return {
		login: login,
		signup: signup
		
	}
}