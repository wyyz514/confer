var express = require('express');
var app     = express();
var bcrypt  = require('bcrypt');

var bodyParser = require('body-parser');
var morgan     = require('morgan');

var PORT       = process.env.PORT || 3000;

const models = require('./loginserver/models/index');

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

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

morgan(':method :url :status :res[content-length] - :response-time ms');

app.get('/', function(req, res){
    res.write('Home');
    res.end();
});

//view handlers
app.get('/login', function(req, res){
    res.render('login', {displaySuccess: false});    
});

app.get('/signup', function(req, res){
    res.render('signup', {
        displaySuccess: false
    });    
});

//form submission handlers
app.post('/login', function(req, res) {
    var email    = req.body.email;
    var password = req.body.password;
	
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
});

app.post('/signup', function(req, res){
    var email    = req.body.email;
    var password = req.body.password;
    var confirm  = req.body.confirm;
    
    if (email && password && confirm) {
		models.login_credentials.create({email_address: email, hashed_password: app.locals.encryptPass(password)})
        .then(() => {
          res.render('signup', {
           email: email,
           password: app.locals.encryptPass(password),
           confirm: app.locals.compare(confirm, app.locals.encryptPass(password)),
           displaySuccess: true
        });
        });
    }    
    else {
        res.render('signup', {
            displaySuccess: false
        });    
    }
    
});

// synchronize models and start server 
console.log('Synchorinizing models...');
models.sequelize.sync().then(function() {
	console.log('DB models in sync, starting server...');
	app.listen(PORT, function(){
		console.log('listening on port', PORT);
	});
});
