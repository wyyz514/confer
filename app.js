var express    = require('express');
var app        = express();
var encyptor   = require('./app/helpers/encryptor');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var auth       = require('./app/routes/auth');

var port       = process.env.PORT || 3000;
var models = require('./app/db/models/index');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.render('index');
});

app.use('/auth', auth);

// app.listen(port, function() {
    // console.log('listening on port', port);
// });

// synchronize models and start server 
console.log('Synchorinizing models...');
models.sequelize.sync().then(function() {
	console.log('DB models in sync, starting server...');
	app.listen(port, function(){
		console.log('listening on port', port);
	});
});