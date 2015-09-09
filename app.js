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

function respond(req, res, next) {
	if(req.user) {
		res.send(200, "Authenticated!");
	} else {
		res.send('hello ' + req.params.name);
	}
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
