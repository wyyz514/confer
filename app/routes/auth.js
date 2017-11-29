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
			res.redirect('/profile');
		} else {
			req.flash("danger", "Invalid credentials. Please try again.")
			res.redirect('/auth/login');
		}
	});

	router.post('/signup', auth.signup(), function(req, res){

		if (! res.locals.err) {
			if(res.locals.userAlreadyExists) {
				req.flash("danger", "A user with this email already exists.")
				res.redirect('/auth/signup');
			} else {
				req.flash("success", "Your account has been successfully created. You can now log in.")
				res.redirect('/auth/login');
			}	
		} else {
			console.log(res.locals.err);
			req.flash("danger", "Something went wrong.")
			res.redirect('/auth/signup');
		}
		
	});
	
	router.get('/logout', auth.logout());
    return router;
}