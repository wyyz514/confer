var express    = require('express');
var app        = express();
var encryptor  = require('./app/helpers/encryptor');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var port       = process.env.PORT || 3000;
var db         = require('./app/db/db')();
var models     = require('./app/db/models/models')();
var auth       = require('./app/routes/auth')(models);
var admin      = require('./app/routes/admin')(models);
var datatables = require('./app/routes/datatables')(models); 
var profile    = require('./app/routes/profile')(models, encryptor); 
var conference = require('./app/routes/conference')(models); 
var session    = require('express-session');

//initialize admin table and conferences table
if(process.argv.indexOf("init") > -1) {
	var adminInit  = require('./admin-init')(models, encryptor); 
	var conferenceInit = require('./conference-init')(models);
}

else {
	if(process.argv[2] == "admin-init") {
    var adminInit  = require('./admin-init')(models, encryptor);    
}

	if(process.argv.indexOf('conference-init') > -1) {
		var conferenceInit = require('./conference-init')(models);
	}	
}



app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000000 }}));

app.get('/', function(req, res){
    res.render('index');
});

app.use('/admin', admin);

app.use('/auth', auth);

app.use('/datatables', function(req, res, next){
	if(req.session.isLoggedIn) {
		next();
	}
	else {
		res.redirect("/auth/login");
	}
}, datatables);

app.use('/profile', function (req, res, next){
	if (req.session.isLoggedIn) {
		next();
	}
	else {
		res.redirect('/auth/login');
	}
}, profile);

app.use('/conferences', function (req, res, next){
	if (req.session.isLoggedIn) {
		next();
	}
	else {
		res.redirect('/auth/login');
	}
}, conference);

app.listen(port, function(){
    console.log("Listening on port", port);
})


