var restify = require('restify');
var user = require('./lib/user.js');
var friends = require('./lib/friends.js');
var passport = require('passport');
var auth = require('./lib/auth.js');

var server = restify.createServer({
	name: 'ReadyAppBackend',
});

server.use(passport.initialize());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

passport.serializeUser(function(user, done) {
		  done(null, user);
});

passport.deserializeUser(function(user, done) {
		  done(null, user);
});

function respond(req, res, next) {
		console.log("user: " + req.user);
		res.send(200, { user: req.user} );
}

server.get('/', respond);
// include access_token in JSON post
server.post('/login/facebook', auth.isAuthenticated, respond);

exports.start = function () {
	server.listen(process.env.PORT || 8080, function() {
		console.log('%s listening at %s', server.name, server.url);
	});
}

exports.close = function () {
	server.close();
}

this.start();
