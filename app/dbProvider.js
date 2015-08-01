/**
 * Created by Elias on 7/27/2015.
 */
var mongoose = require('mongoose');

var User = require('../app/models/user');

var dbProvider = function (options) {
    var self = this;
    
    mongoose.connect(options.connectionString, {
        user: options.user,
        pass: options.pass
    });
    
    self.getUserById = function (id, callback) {
        User.findById(id, callback);
    };
    
    self.getUserByEmail = function (email, callback) {
        var query = {
            'local.email' : email
        };
        User.findOne(query, callback);
    };
    
    self.getUserByFacebookId = function (profileId, callback) {
        var query = {
            'facebook.id' : profileId
        };
        User.findOne(query, callback);
    };
    
    self.getUserByGoogleId = function (profileId, callback) {
        var query = {
            'google.id' : profileId
        };
        User.findOne(query, callback);
    };
    
    self.createUser = function (email, password, callback) {
        var user = new User();
        user.local.email = email;
        user.local.password = user.generateHash(password);
        user.save(function (err) {
            return callback(err, user);
        });
    };
    
    self.createUserFromFacebook = function (profile, token, callback) {
        var user = new User();
        user.facebook.id = profile.id;
        user.facebook.token = token;
        user.facebook.displayName = profile.displayName;
        user.save(function (err) {
            return callback(err, user);
        });
    };
    
    self.createUserFromGoogle = function (profile, token, callback) {
        var user = new User();
        user.google.id = profile.id;
        user.google.token = token;
        user.google.displayName = profile.displayName;
        user.google.profilePicture = profile._json.image.url;
        user.save(function (err) {
            return callback(err, user);
        });
    };
    
    self.updateGoogleProfilePicture = function (user, profile, callback) {
        if (user.profilePictureUrl === profile._json.image.url) {
            return callback(null, user);
        }
        user.google.profilePictureUrl = profile._json.image.url;
        user.save(function (err) {
            return callback(err, user);
        });
    };
};

module.exports = dbProvider;