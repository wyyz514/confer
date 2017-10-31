var express    = require('express');
var app        = express();
var encryptor  = require('./app/helpers/encryptor');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var port       = process.env.PORT || 3000;
var db         = require('./app/db/db')();
var models     = require('./app/db/models/models')();
var auth       = require('./app/routes/auth')(models);
//var adminInit  = require('./admin-init')(models, encryptor);

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

// app.get('/myconferences', function(req, res) {
//     res.render('myconferences');
// });

app.listen(port, function(){
    console.log("Listening on port", port);
})


