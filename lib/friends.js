var database = require('./database');

// GET /friends/{userId}
exports.getFriendList = function (req, res, next) {
//	console.log('Finding: ' + req.params.userId);
	database.findUser(req.params.userId, function (err, obj) {
		if(obj != null) {
			user = obj.toObject();
		//	console.log("found " + user + " friend list");
			user = removeFields(user);
			res.send(200, user.friendList);
		} else {
			res.send(404, {"error": err});			
		}
	});
}

// POST /friends/{userId}/{friendId}
exports.addFriend = function (req, res, next) {
//	console.log('Finding friend: ' + req.params.friendId);
	database.findUser(req.params.friendId, function (err, obj) {
		if(!obj) res.send(404, {"error": err});		
		database.addFriend(req.params.userId, req.params.friendId, function (err, obj) {			
			database.addFriend(req.params.friendId, req.params.userId, function (err, obj) {
				database.findUser(req.params.userId, function (err, obj) {
					user = obj.toObject();
					user = removeFields(user);
					res.send(200, user);
				});
			});		
		});	
	});
}

exports.deleteFriend = function (req, res, next) {
	database.findUser(req.params.friendId, function (err, obj) {
		if(!obj) res.send(404, {"error": err});	
		user = obj.toObject();
		database.deleteFriend(req.params.userId, req.params.friendId, function (err, obj) {	
			database.findUser(req.params.userId, function (err, obj) {
				user = obj.toObject();
				user = removeFields(user);
				res.send(200, user);
			});
		});
	});
}

function removeFields(user) {
	delete user.__v
	delete user._id
	delete user.password
	for(var i = 0; i < user.friendList.length; i++) {
	    delete user.friendList[i]._id
	}

	return user
}