var express = require('express');

var path = require('path');
var argon2max = require('argon2themax');
var argon2 = require('argon2');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');
var flash = require ('connect-flash');

var fs = require('fs');


var port = (process.env.PORT || 3000);
var longhash ="";

var bodyParser = require('body-parser');
var cookieParser = require ('cookie-parser');
var session = require ('express-session');

require('./config/passport.js')(passport);


app.set('view engine','ejs');

app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use(cookieParser());


//get mongoconnected thru mongoose
var uri ='mongodb://ssripada:kishMira1025@' +
'cluster0-shard-00-00-jrzz3.mongodb.net:27017,' +
'cluster0-shard-00-01-jrzz3.mongodb.net:27017,' +
'cluster0-shard-00-02-jrzz3.mongodb.net:27017' +
'/fastmapusers?ssl=true&replicaSet=Cluster0-shard' +
'-0&authSource=admin'

mongoose.connect(uri);
var db = mongoose.connection;

var collections = mongoose.connections[0].collections;
var names = [];

/*Object.keys(collections).forEach(function(k) {
    names.push(k);
});

console.log('database name: ' + names);

db.on('error', console.error.bind(console, 'connection error:'));
db.once ('open', function () {
	console.log ('we are connected to MongoDb');
});
*/



//set upp passport - these are required for passport
app.use(session({
				secret: 'whatsupyo', 
				cookie: {maxAge: 120000}
				})
		);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./models/routes.js')(app,passport);


app.listen(port,function() {
	console.log('listening on port: ' + port);
});

