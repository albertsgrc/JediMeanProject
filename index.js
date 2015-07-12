var http = require('http');
var express = require('express');
var winston = require('winston');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressWinston = require('express-winston');
var config = require('./config');
var cors = require('cors');
var compression = require('compression');
var express_jwt = require('express-jwt');

mongoose.connect(config.DB_URI, function(err) {
    if (err) console.error("Couldn't connect to database: " + err);
    else console.log("Successfully connected to database");
});

var models = require('./server/models')();

var usersRouter = require('./server/routes/users');
var agendasRouter = require('./server/routes/agendas');
var contactsRouter = require('./server/routes/contacts');

var app = express();

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');

app.use(compression());
app.use(bodyParser.json());
app.use(cors());
app.use(expressWinston.logger(config.WINSTON_OPTIONS));

app.use('/user', usersRouter);
app.use('/agenda', agendasRouter);
app.use('/contact', contactsRouter);

app.get('*', function(req, res) { res.render('index'); });

app.use(function(req, res) {
   res.status(404).send("Wrong url");
});

http.createServer(app).listen(config.APP_PORT, function() {
   console.log("Server listening on port " + config.APP_PORT);
});
