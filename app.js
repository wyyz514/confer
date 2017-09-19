var express = require('express');
var app     = express();
var bcrypt  = require('bcrypt');

var bodyParser = require('body-parser');
var morgan     = require('morgan');

var PORT       = process.env.PORT || 3000;

//encryption helpers
app.locals = {
    encryptPass: function (toEncrypt) {
        var hash = bcrypt.hashSync(toEncrypt, 10); //10 is salt rounds...whatever that means
        return hash;
    },
    
    compare: function (notEncrypted, encrypted) {
        return bcrypt.compareSync(notEncrypted, encrypted);
    }
};

//some middlewares
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded/ parse request body
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//start server
app.listen(PORT, function(){
    console.log('listening on port', PORT);
});

//get handler for index/home page
app.get('/', function(req, res){
   res.render('index');
});

//get handlers for login and signup. Returns views
app.get('/login', function(req, res){
    res.render('login');    
});

app.get('/signup', function(req, res){
    res.render('signup', {
        displaySuccess: false
    });    
});

//form submission handlers
app.post('/login', function(req, res) {
    
});

app.post('/signup', function(req, res){
    var email    = req.body.email;
    var password = req.body.password;
    var confirm  = req.body.confirm;
    
    if (email && password && confirm) {
        res.render('signup', {
           email: email,
           password: app.locals.encryptPass(password),
           confirm: app.locals.compare(confirm, app.locals.encryptPass(password)),
           displaySuccess: true
        });    
    } 
    else {
        res.render('signup', {
            displaySuccess: false
        });    
    }
    
});