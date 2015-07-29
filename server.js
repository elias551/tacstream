/**
 * Created by Elias on 7/27/2015.
 */
var express = require('express'),
    dbProvider = require('./dbProvider');
var favicon = require('serve-favicon');

function createApp() {
    var result = express();
    
    // view engine
    result.set('views', __dirname + '/views');
    result.set('view engine', 'jade');
    result.engine('jade', require('jade').__express);
    result.use(favicon(__dirname + '/public/favicon.ico'));
    
    // public folder
    result.use(express.static(__dirname + '/public'));
    result.set('dbProvider', new dbProvider(process.env.TACSTREAM_CONNECTION_STRING));
    
    return result;
}

var app = createApp();

// routing
app.get('/', function (req, res) {
	res.render('page');
});


/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
app.use(function (err, req, res, next) {
    console.error(err.stack);
    if (app.get('env') !== 'development') {
        err = {};
    }
    res.status(err.status || 500);
    res.render('error', {
        statusCode: res.statusCode,
        message: err.message,
        error: err.stack
    });
});







var port = process.env.PORT || 5000;
var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
	socket.emit('message', {
		message: 'welcome to the chat'
	});
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});
