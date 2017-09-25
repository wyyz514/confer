var express   = require('express');
var router    = express.Router();
var encryptor = require('../helpers/encryptor');
var auth      = require('../middlewares/auth');

//view handlers
router.get('/login', function(req, res){
    res.render('auth/login');    
});

router.get('/signup', function(req, res){
    res.render('auth/signup');    
});

//form submission handlers
router.post('/login', auth.login(), function(req, res) {
    
});

router.post('/signup', auth.signup(), function(req, res){
  
});

module.exports = router;