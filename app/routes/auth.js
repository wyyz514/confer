var express   = require('express');
var router    = express.Router();
var encryptor = require('../helpers/encryptor');



module.exports = function(models) {
	var auth      = require('../middlewares/auth')(models.User);
	
	//view handlers
	router.get('/login', function(req, res){
		res.render('auth/login');    
	});

	router.get('/signup', function(req, res){
		res.render('auth/signup');    
	});

	//form submission handlers
	router.post('/login', auth.login(), function(req, res) {
		console.log("isAuthenticated ? ", res.locals.authenticated);
		if(res.locals.authenticated) {
			res.locals.type    = "success";
			res.locals.message = "You successfully logged in.";
			
			var privilegesPromise = new Promise(function(resolve, reject) {
				models.Privilege.find({email: res.locals.authenticatedEmail}, function(err, obj){
					resolve(obj);
				});
			});
			
			privilegesPromise.then(function(privileges){
				var enhanced = privileges.map(function(privilege) {
					return new Promise(function(resolve, reject){
						var obj = {};
						models.Track.findById(privilege.tid, function(err, track){
							obj.trackName = track.name;
						}).then(function() {
							models.Conference.findById(privilege.cid, function(err, conf) {
								obj.conferenceName = conf.name;
								obj.conferenceId   = conf.id;
								resolve(obj);
							})
						})	
					});
				});
				
				Promise.all(enhanced).then(function(conferences){
					res.render('myconferences', {conferences: conferences});	
				});
			})
			
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