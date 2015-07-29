/**
 * Created by Elias on 7/27/2015.
 */
var mongoose = require('mongoose');

var dbProvider = function (connectionString) {
    var self = this;

    mongoose.connect(connectionString);
    
    self.getUsers = function () {
        return "users";
    };
};

module.exports = dbProvider;