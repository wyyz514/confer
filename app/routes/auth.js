var express   = require('express');
var router    = express.Router();
var encryptor = require('../helpers/encryptor');



module.exports = function(models) {
	var auth      = require('../middlewares/auth')(models);
	
	//view handlers
	router.get('/login', function(req, res){
		res.render('auth/login');    
	});

	router.get('/signup', function(req, res){
		res.render('auth/signup');    
	});

	//form submission handlers
	router.post('/login', auth.login(), function(req, res) {
		//if the credentials passed are valid
		if(res.locals.authenticated) {
			//display the myconferences page
			res.redirect('/myconferences');
		} else {
			//for res.locals.err, make new condition branch
			res.locals.type = "danger";
			res.locals.message = "An error occurred.";
			res.render('auth/login');
		}
	});

	router.post('/signup', auth.signup(), function(req, res){
		console.log(res.locals.userAlreadyExists);
		if (! res.locals.err) {
			if(res.locals.userAlreadyExists) {
				res.locals.type    = "danger";
				res.locals.message = "An account for this email already exists.";
				res.render('auth/signup');
			} else {
				res.locals.type = "success";
				res.locals.message = "Your account has been successfully created.";
				res.render('auth/login');
			}	
		} else {
			res.locals.type = "danger";
			res.locals.message = res.locals.err.toString();
			res.render('auth/signup');
		}
		
	});

    return router;
}