/**
 * Created by Elias on 7/27/2015.
 */
var express                 = require('express'), 
    session                 = require('express-session'),
    cookieParser            = require('cookie-parser'),
    bodyParser              = require('body-parser'),
    compression             = require('compression'),
    favicon                 = require('serve-favicon'),
    passport                = require('passport'),
    flash                   = require('connect-flash'),
    
    port                    = process.env.PORT || 5000,
    sessionSecret           = process.env.TACSTREAM_SESSION_SECRET || 'coucou',

    passportConfig          = require('./config/passport'),
    dbProvider              = require('./app/dbProvider'),
    errorHandler            = require('./app/errorHandler'),
    routes                  = require('./app/routes');


function createApp() {
    var result = express();
    require('express-dynamic-helpers-patch')(result);
    result.dynamicHelpers({
        auth: function (req, res) {
            return req.session.auth;
        }
    });

    // public folder
    result.use(express.static(__dirname + '/public'));
    
    // view engine
    result.set('views', __dirname + '/views');
    result.set('view engine', 'jade');
    result.engine('jade', require('jade').__express);

    result.use(cookieParser());
    result.use(bodyParser.urlencoded({
        extended: true
    }));
    result.use(session({
        secret: sessionSecret, 
        resave: true, 
        saveUninitialized: true
    }));
    result.use(bodyParser.json());
    result.use(compression());
    result.use(passport.initialize());
    result.use(passport.session());
    result.use(flash());
    result.use(favicon(__dirname + '/public/favicon.ico'));
    
    var dataProvider = new dbProvider({
        connectionString: process.env.TACSTREAM_DB_CONNECTION_STRING,
        user: process.env.TACSTREAM_DB_USER,
        pass: process.env.TACSTREAM_DB_PASS
    });
    passportConfig.configure(passport, dataProvider);
    result.set('dataProvider', dataProvider);
    
    return result;
}

var app = createApp();

routes.setup(app, passport);

app.use(errorHandler.unknownRouteHandler);
app.use(errorHandler.generalHandler);

var server = app.listen(port);
console.log("Listening on port " + port);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	socket.emit('message', {
		message: 'welcome to the chat'
	});
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});
