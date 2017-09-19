var express = require('express');
var app     = express();

var bodyParser = require('body-parser');
var morgan     = require('morgan');

var PORT       = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

morgan(':method :url :status :res[content-length] - :response-time ms');

app.listen(PORT, function(){
    console.log('listening on port', PORT);
});

app.get('/', function(req, res){
    res.write('Home');
    res.end();
});

app.get('/login', function(req, res){
    res.render('login');    
});

app.get('/signup', function(req, res){
    res.render('signup');    
});

app.post('login', function(req, res) {
    
});

app.post('signup', function(req, res){
    
});