var express   = require('express');
var router    = express.Router();
var encryptor = require('./helpers/encryptor');
var auth      = require('./middlewares/auth');

//view handlers
router.get('/login', function(req, res){
    res.render('login');    
});

router.get('/signup', function(req, res){
    res.render('signup');    
});

//form submission handlers
router.post('/login', auth.login(), function(req, res) {
    
	var status = res.locals.status;
    
    res.render(status.destination, { message: status.message });
    
    /*
	if(email && password) {
		var query = {email_address : email};
		var user = models.login_credentials.find({where: query})
		.then(function(user) {
			if (user) {
				// User exists, compare password
				bcrypt.compare(password, user.hashed_password, function (err, doesMatch) {
					if (doesMatch) {
						res.render('login', {
							displaySuccess: true,
							message: 'You kinda logged in successfully'
						})
					}
				});
			}
		});
	}
    */
    
});

router.post('/signup', auth.signup(), function(req, res){
    
    var status = res.locals.status;
    
    res.render(status.destination, { message: status.message });
    /*
    if (email && password && confirm) {
		models.login_credentials.create({email_address: email, hashed_password: app.locals.encryptPass(password)})
        .then(() => {
          res.render('signup', {
           email: email,
           password: encryptor.encryptPass(password),
           confirm:  encryptor.compare(confirm, encryptor.encryptPass(password)),
           displaySuccess: true
        });
        });
    }    
    else {
        res.render('signup', {
            displaySuccess: false
        });    
    }
    */
    
});

module.exports = router;