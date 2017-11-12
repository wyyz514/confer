var express    = require('express');
var router     = express.Router();

module.exports = function (models, encryptor) {
    router.get('/', function (req, res) {
        models.User.findOne({email: req.session.authenticatedEmail}, function (err, loggedInUser) {
            if (!err && loggedInUser != null) {
                res.render('profile/index', {user: loggedInUser});  
            }
            else {
                //display error page with link to login
            }
        });
    });
    
    router.get('/edit', function (req, res) {
        models.User.findOne({email: req.session.authenticatedEmail}, function (err, loggedInUser) {
            if (!err && loggedInUser != null) {
                res.render('edit/profile', {user: loggedInUser});  
            }
            else {
                //display error page with link to login
            }
        });
    });
    
    router.post('/edit', function (req, res) {
        var firstName = req.body.firstname;
        var lastName  = req.body.lastname;
        var email     = req.body.email;
        var password  = req.body.password;
        
        models.User.findOne({email: req.session.authenticatedEmail}, function (err, loggedInUser) {
            if (!err && loggedInUser != null) {
                loggedInUser.set('firstname', firstName);
                loggedInUser.set('lastname', lastName);
                loggedInUser.set('email', email);
                loggedInUser.set('password', encryptor.encryptPass(password));
                
                loggedInUser.save(function(err, savedUser) {
                    if(!err && savedUser != null) {
                        res.json({
                           status: 200,
                           target: "/profile"
                        });
                    }
                    else {
                        //handle error
                    }
                })
            }
            else {
                //display error page with link to login
            }
        });
    });
    
    return router;
};