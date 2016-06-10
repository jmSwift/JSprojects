var express = require('express');
var app = express();

var morgan = require('morgan');



var mongoose = require('mongoose');

var bodyParser = require('body-parser');



var ejs = require('ejs');
var ejsMate = require('ejs-mate'); // for flexible webpages , supercharged ejs

var User = require('./models/user');



 //<dbuser>:<dbpassword>@ds021663.mlab.com:21663/ecommerce
mongoose.connect('mongodb://jmswift:1Legions!@ds021663.mlab.com:21663/ecommerce', function(err) {
	if(err)
		console.log(err);
	else
		console.log("Connected to database");
});

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');

//routes
app.get('/', function(req, res){
	res.render("main/home");
});

app.get('/about', function(req, res){
	res.render("main/about");
});

//next is a callback
app.post('/create-user', function(req,res,next){

	var user = new User();// new instance of user object

	user.profile.name = req.body.name;
	user.password = req.body.password;
	user.email = req.body.email;

	user.save(function(err) {
		if(err)
			return next(err);
		res.json("successfully created a new user");
	})
});



app.listen(3000,function(error) {
	if(error)
		throw error;
	console.log("server is running on port 3000");
});

