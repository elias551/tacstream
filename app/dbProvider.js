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
    
    self.getUserByEmail = function (email, callback) {
        User.findOne({ 'local.email' : email }, callback);
    };

    self.getUserById = function (id, callback) {
        User.findById(id, callback);
    };

    self.createUser = function (email, password, callback) {
        var user = new User();
        user.local.email = email;
        user.local.password = user.generateHash(password);
        user.save(function (err) {
            if (err) {
                callback(err);
                return;
            }
            return callback(null, user);
        });
    };
};

module.exports = dbProvider;