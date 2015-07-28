/**
 * Created by Elias on 7/27/2015.
 */

var express = require('express');
var app = express();


// view engine
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);


// routing
app.get('/', function (req, res) {
	res.render('page');
});

// public folder
app.use(express.static(__dirname + '/public'));

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
