var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require ('passport-local');
var User = require("./models/user")
// var https = require('https');
// var http = require('http');
// var fs = require('fs');

// const httpsOptions = {
// 	cert: fs.readFileSync('./certificates/localhost.crt'),
// 	key: fs.readFileSync('./certificates/localhost.key')
// };

var app = express();
var httpApp = express();
var mongoDB = 'mongodb://127.0.0.1/diborecast';

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
	secret: "yoloswager",
	resave: false,
	saveUnitialized: false
}));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB error de conexión:'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var port = 8080;

app.get('/login',function(req,res){
	res.render('login');
});

app.get('/register',function(req,res){
	res.render('register');
});

app.get('/error',function(req,res){
	res.render('error');
});

app.get('/home',isLoggedIn,function(req,res){
	res.render('home');
});

app.post("/register", function(req,res){
	var newuser = new User({username: req.body.username, nombre: req.body.nombre, apellido: req.body.apellido});
	User.register(newuser, req.body.password, function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		} 
		passport.authenticate("local")(req,res,function(){
			res.redirect("/home");
		});
	});
});

app.post("/login", passport.authenticate("local",
	{
		successRedirect:"/dashboard",
		failureRedirect:"/error"
	}), function(req,res){
});

app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/login");
});

app.listen(port,function(req,res){
	console.log('Escuchando en el puerto: ' + port);
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");	
	}
};


// ---------------------------------- HABILITAR PARA HTTP Y HTTPS ------------------------------------------

// https.createServer(httpsOptions, app)
// 	.listen(port, function(){
// 		console.log("Servidor https habilitado");
// });
// // SERVIDOR HTTP HABILITADO EN PUERTO 8081
// httpApp.set('port', 8081);

// // REDIRIGIENDO TODAS LAS PETICIONES DEL SERVIDOR HTTP AL HTTPS
// httpApp.get("*", function (req, res, next) {
//     res.redirect("https://" + req.headers.host + req.path);
// });