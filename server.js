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
    
    port                    = process.env.PORT,
    env                     = process.env.NODE_ENV || 'local',
    sessionSecret           = process.env.TACSTREAM_SESSION_SECRET,
    
    authConfig              = require('./config/auth'),
    passportConfig          = require('./config/passport'),
    dbProvider              = require('./app/dbProvider'),
    errorHandler            = require('./app/errorHandler'),
    routes                  = require('./app/routes');

if (env === 'local') {
    port = 8080;
}

function createApp() {
    var app = express();
    require('express-dynamic-helpers-patch')(app);
    app.dynamicHelpers({
        displayName: function (req, res) {
            return getUserName(req.user);
        }
    });
    
    function getUserName(auth) {
        if (!auth) {
            return null;
        }
        return auth.local.email || auth.google.displayName || auth.facebook.displayName;
    }

    // public folder
    app.use(express.static(__dirname + '/public'));
    
    // view engine
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.engine('jade', require('jade').__express);
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(session({
        secret: sessionSecret, 
        resave: true, 
        saveUninitialized: true
    }));
    app.use(bodyParser.json());
    app.use(compression());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(favicon(__dirname + '/public/favicon.ico'));
    app.enable('trust proxy');
    
    if (env === 'production') {
        app.use(function (req, res, next) {
            if (req.headers['x-forwarded-proto'] !== 'https') {
                return res.redirect(['https://', req.get('Host'), req.url].join(''));
            }
            return next();
        });
    }
    
    var dataProvider = new dbProvider(authConfig.mongo);
    passportConfig.configure(passport, dataProvider);
    app.set('dataProvider', dataProvider);
    
    return app;
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
