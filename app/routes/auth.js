var express   = require('express');
var router    = express.Router();
var encryptor = require('../helpers/encryptor');

module.exports = function(User) {
	var auth      = require('../middlewares/auth')(User);
	//view handlers
	router.get('/login', function(req, res){
		res.render('auth/login');    
	});

	router.get('/signup', function(req, res){
		res.render('auth/signup');    
	});

	//form submission handlers
	router.post('/login', auth.login(), function(req, res) {
		console.log(res.locals.authenticated);
		if(res.locals.authenticated) {
			res.locals.type    = "success";
			res.locals.message = "You successfully logged in.";
			res.render('index');
		} else {
			res.locals.type = "danger";
			res.locals.message = "An error occurred.";
			res.render('auth/login');
		}
	});

	router.post('/signup', auth.signup(), function(req, res){
		console.log("we put a change here");
		console.log(res.locals.userAlreadyExists);
		if(res.locals.userAlreadyExists) {
			res.locals.type    = "danger";
			res.locals.message = "An account for this email already exists.";
			res.render('auth/signup');
		} else {
			res.locals.type = "success";
			res.locals.message = "Your account has been successfully created.";
			res.render('auth/login');
		}
	});

    return router;
}