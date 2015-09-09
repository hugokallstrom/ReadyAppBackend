var database = require('./database');
var passport = require('passport');
var auth = require('./auth.js');
	
// POST /ip/{userId}
exports.addIp = function (req, res, next) {
//	console.log('Adding ip for: ' + req.params.userId);
	var body = JSON.parse(req.body);
	database.addIpToDB(req.params.userId, body.ip, function (err, ip) {
		if(err) res.send(404, {"error": err});
		res.send(201, {"ip": ip});
	});
}

exports.getIp = function (req, res, next) {
//	console.log('Getting ip for: ' + req.params.userId);
	database.findIp(req.params.userId, function (err, entry) {
		if(err) res.send(404, {"error": err});
		var ip = entry.toObject();
		res.send(200, {"ip": ip.ip});
	});
}