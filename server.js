var express = require('express');
var app = express();

var morgan = require('morgan');

var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var ejs = require('ejs');
var ejsMate = require('ejs-mate'); // for flexible webpages , supercharged ejs

var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

var User = require('./models/user');

var secret = require('./config/secret');

var mongoStore = require('connect-mongo/es5')(session);//specifically to store sessions on server side

var passport = require('passport');

 //<dbuser>:<dbpassword>@ds021663.mlab.com:21663/ecommerce
mongoose.connect(secret.database, function(err) {
	if(err)
		console.log(err);
	else
		console.log("Connected to database");
});

//middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUnitialized: true,
	secret: secret.secretKey,
	store: new mongoStore({url: secret.database, autoReconnect: true })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
})

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(secret.port,function(error) {
	if(error)
		throw error;
	console.log("server is running on port" + secret.port);
});
