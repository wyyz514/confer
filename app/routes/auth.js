var express   = require('express');
var router    = express.Router();
var encryptor = require('../helpers/encryptor');
var auth      = require('../middlewares/auth');

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
    
    res.render(status.destination);
    
});

router.post('/signup', auth.signup(), function(req, res){
    
    var status = res.locals.status;
    
    res.render(status.destination);
    
});

module.exports = router;