exports = module.exports = {};
var mongoose = require('mongoose');
var dateformat = require('dateformat');
var User = require('./userSchema');
var IP = require('./ipSchema');
var uriString = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/readyAppDB' || 'mongodb://127.0.0.1/'

mongoose.connect(uriString, function(err) {
	if(err) 
		console.log(err);
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});

function createUser (profile) {
	var user = new User();
	user.name = profile.name.givenName;
	user.lastName = profile.name.familyName;
	user.email = profile.emails[0].value;
	user.userId = profile.userId;
	user.password = "";
	user.profilePicture = "Not specified";
	user.lastOnline = "Never";
	user.yourFriend = false;
	return user;
}

var addUserToDB = function (profile, callback) {
	var user = createUser(profile);		
	user.save(function (err) {
		if(err) return callback("Error when saving to database", null);
		callback(null, user);
	});
}

var addIpToDB = function (username, userIp, callback) {
	IP.findOneAndUpdate({ userId: username }, { ip: userIp }, { upsert: true }, function (err, entry) {
		if(err) return callback(err, null);
		return callback(null, entry);
	});
}

var findIp = function (username, callback) {
	IP.findOne({userId: username}, function (err, entry) {
		if(err) return callback(err, null);
		if(entry) return callback(null, entry);
		callback("Not found", null);
	});
}

var findUser = function (username, callback) {
	User.findOne({ userId: username }, function (err, user) {
		if(err) return callback(err, null);
		if(user == null) return callback("Not found", null);
		callback(null, user);
	});
}

var searchForUser = function (keyword, callback) {
	var expression = new RegExp(keyword, "i");
	User.find({ userId: expression }, function (err, user) {
		if(err) return callback(err, null);
		if(user.length == 0) return callback("Not found", null);
		callback(null, user);
	});
}

var addFriend = function (username, friendName, callback) {
	findUser(username, function (err, user) {
		if(err) return callback("Not found", null);
		checkIfFriends(user, friendName, function (err) {
			if(err) return callback(err, null);
			findUser(friendName, function (err, friend) {
				if(err) return callback("Not found", null);
				User.findOneAndUpdate({userId: username}, {$push: {friendList: {userId: friendName}}}, { upsert: true }, function(err, data){
	  				if(err) return callback(err, null);
	  				callback(null, friendName);
				});
			});
		});
	});
}

function checkIfFriends (user, friend, callback) {
	user = user.toObject();
	for(var i = 0; i < user.friendList.length; i++) {
		if(user.friendList[i].userId === friend) {
			return callback("Already friends");
		}
	}
	return callback(null);
}

var deleteFriend = function (username, friendName, callback) {
	findUser(username, function (err, user) {
		if(err) return callback("Not found", null);
		findUser(friendName, function (err, friend) {
			if(err) return callback("Not found", null);
			User.findOneAndUpdate({userId: username}, {$pull: {friendList: {userId: friendName}}}, { upsert: true }, function(err, data){
  				if(err) return callback(err, null);
  				callback(null, friendName);
			});
		});
	});
}

var setLastOnline = function (username, callback) {
	findUser(username, function (err, obj) {
		if(err) return callback(err, null);
		var date = new Date();
		date = dateformat(date, "dddd, mmmm dS, yyyy");	
		User.findOneAndUpdate({userId: username}, {$set: {lastOnline: date }}, function(err, data){
  			if(err) return callback(err, null);
  			callback(null, date);
		});
	});
}

// Test purpose
var clearUsers = function () {
	User.remove({}, function (err) {});
}

module.exports = {
	addUserToDB: addUserToDB,
	findUser: findUser,
	searchForUser: searchForUser,
	clearUsers: clearUsers,
	addFriend: addFriend,
	deleteFriend: deleteFriend,
	addIpToDB: addIpToDB,
	findIp: findIp,
	setLastOnline: setLastOnline
}
