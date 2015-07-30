/**
 * Created by Elias on 7/27/2015.
 */
var setup = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index');
    });
    
    app.route('/login')
        .get(function (req, res) {
            if (req.isAuthenticated()) {
                return res.redirect('/home');
            }
            res.render('login', { message: req.flash('loginMessage') });
        })
        .post(passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    
    app.route('/signup')
        .get(function (req, res) {
            res.render('signup', { message: req.flash('signupMessage') });
        })
        .post(passport.authenticate('local-signup', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
        successRedirect : '/home',
        failureRedirect : '/'
    }));
    
    
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    
    app.get('/auth/google/callback',
            passport.authenticate('google', {
        successRedirect : '/home',
        failureRedirect : '/'
    }));

    app.get('/home', isLoggedIn, function (req, res) {
        res.render('profile', {
            user : req.user
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports.setup = setup;