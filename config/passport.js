var 
    LocalStrategy       = require('passport-local').Strategy,
    FacebookStrategy    = require('passport-facebook').Strategy,
    GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy,
    
    configAuth          = require('./auth.js');


function buildLocalStrategy(action) {
    return new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, action);
}

function configure(passport, dataProvider) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        dataProvider.getUserById(id, function (err, user) {
            done(err, user);
        });
    });
    
    passport.use('local-signup', buildLocalStrategy(function (req, email, password, done) {
        dataProvider.getUserByEmail(email, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }
            dataProvider.createUser(email, password, function (err, newUser) {
                if (err) {
                    throw err;
                }
                return done(null, newUser);
            });
        });
    }));
    
    passport.use('local-login', buildLocalStrategy(function (req, email, password, done) {
        dataProvider.getUserByEmail(email, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            return done(null, user);
        });
    }));

    passport.use(new FacebookStrategy(configAuth.facebook,  function (token, refreshToken, profile, done) {
        dataProvider.getUserByFacebookId(profile.id, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, user);
            }
            dataProvider.createUserFromFacebook(profile, token, function (err, user) {
                if (err) {
                    throw err;
                }
                return done(null, user);
            });
        });
    }));


    passport.use(new GoogleStrategy(configAuth.google, function (token, refreshToken, profile, done) {
        dataProvider.getUserByGoogleId(profile.id, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, user);
            }
            dataProvider.createUserFromGoogle(profile, token, function (err, user) {
                if (err) {
                    throw err;
                }
                return done(null, user);
            });
        });
    }));
}

module.exports.configure = configure;