var restify = require('restify');
var user = require('./lib/user.js');
var friends = require('./lib/friends.js');
var passport = require('passport');
var auth = require('./lib/auth.js');
var ip = require('./lib/ip.js');

var server = restify.createServer({
	name: 'ReadyApp',
});

server.use(passport.initialize());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

server.post('/login/:userId', auth.isAuthenticated, user.authenticate);
server.get('/user/:userId', auth.isAuthenticated, user.getUser);
server.post('/user/:userId', auth.isAuthenticated, user.register);
server.post('/register', user.register);
server.get('/friends/:userId', auth.isAuthenticated, friends.getFriendList);
server.post('/friends/:userId/:friendId', auth.isAuthenticated, friends.addFriend);
server.del('friends/:userId/:friendId', auth.isAuthenticated, friends.deleteFriend);
server.post('/ip/:userId', auth.isAuthenticated, ip.addIp);
server.get('/ip/:userId', auth.isAuthenticated, ip.getIp);
server.get('/search/:userId', auth.isAuthenticated, user.search);

exports.start = function () {
	server.listen(process.env.PORT || 8080, function() {
		console.log('%s listening at %s', server.name, server.url);
	});
}

exports.close = function () {
	server.close();
}

this.start();