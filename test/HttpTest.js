var assert = require('assert')	;
var expect = require('chai').expect
var request = require('supertest');
var database = require('../lib/database.js');
var jsonBodies = require('./jsonTestBodies.js');
var server = require('../app.js');

describe('http tests', function () {
	var url = 'http://0.0.0.0:8080';
	before(function (done) {
		var testUser = jsonBodies.createTestRegisterRequest('Johan', 'Edeljung', 'johanede@gmail.com', 'johan123');
		var testUser2 = jsonBodies.createTestRegisterRequest('Markus', 'Sköld', 'macke@gmail.com', 'macke123');
		database.addUserToDB(testUser, function (err, user) {
			if(err) return console.log(err);
			database.addUserToDB(testUser2, function (err, user) {	
				done();
			});
		});
	});

	after(function (done) {
		database.clearUsers();
		done();
	});
	describe('POST /login/{userId}', function () {
		it('should return the user if the login was successful', function (done) {
			request(url)
			.post('/login/johan123')
			.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmV0')
			.expect(200)
			.end(function (err, res) {
				if (err) console.log(err)
				expect(res.body.userId).to.equal("johan123");
				done();
			});
		});

		it('should return 401 code if incorrect username/password', function (done) {
			unauthorizedTest('/login/johan123', function () {
				done();
			});
		});

	});

	describe('GET /user/{userId}', function () {
		it('should return user information if the user exists', function (done) {
			request(url)
			.get('/user/johan123')
			.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmV0')
			.expect(200)
			.end(function (err, res) {
				if (err) console.log(err)
				done();
			});
		});

		it('should return Not found-error if the user dont exists', function (done) {
			request(url)
			.get('/user/noUser')
			.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmV0')
			.expect(404)
			.end(function (err, res) {
				if (err) console.log(err)
				expect(res.body.error).to.equal("Not found");
				done();
			});
		});

		it('should return unauthorized code if incorrect username/password', function (done) {
			unauthorizedTest('/user/johan123', function () {
				done();
			});
		});
	});

	describe('POST /register', function () {
		it('should return 200 code if the registration was successful', function (done) {
			var registerRequest = '{ "name": "Johan", "lastName": "Edeljung", "email": "johanede@mail.com", "userId": "NewUser", "password": "secret" }'
			request(url)
			.post('/register')
			.send(registerRequest)
			.expect(200)
			.end(function (err, res) {
				if (err) console.log(err)
				done();
			})
		});

		it('should return not found and User exists-error if username is registrated', function (done) {
			var registerRequest = '{"name": "Johan2", "lastName": "Edeljung2", "email": "johanede2@mail.com", "userId": "johan123", "password": "secret"}'
			request(url)
			.post('/register')
			.send(registerRequest)
			.expect(404)
			.end(function (err, res) {
				if (err) console.log(err)
				expect(res.body.error).to.equal("User exists");
				done();
			})
		});
	});

	describe('POST /friends/{userId}/{friendId}', function () {
		it('should return 200 code and the updated user information', function (done) {
			request(url)
			.post('/friends/johan123/macke123')
			.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmV0')
			.expect(200)
			.end(function (err, res) {
				if (err) console.log(err)
				expect(res.body.friendList[0].userId).to.equal("macke123");
				expect(res.body.userId).to.equal("johan123");
				done();
			});
		});

		it('should add the friend on the requesting users friend list', function (done) {
			request(url)
			.get('/user/johan123')
			.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmV0')
			.expect(200)
			.end(function (err, res) {
				if (err) console.log(err)
				expect(res.body.friendList[0].userId).to.equal("macke123");
				done();
			});
		});

		it('should add the requester on the friend users friend list', function (done) {
			request(url)
			.get('/user/macke123')
			.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmV0')
			.expect(200)
			.end(function (err, res) {
				if (err) console.log(err)
				expect(res.body.friendList[0].userId).to.equal("johan123");
				done();
			});
		});

		it('should return Not found-error if the friend id does not exist', function (done) {
			request(url)
			.post('/friends/johan123/noUser')
			.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmV0')
			.expect(404)
			.end(function (err, res) {
				if (err) console.log(err)
				expect(res.body.error).to.equal("Not found");
				done();
			});
		});
	});

	describe('DELETE /friends/{userId}/{friendId}', function () {
		it('should return 204 code and the updated user information', function (done) {
			request(url)
			.del('/friends/johan123/macke123')
			.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmV0')
			.expect(200)
			.end(function (err, res) {
				if (err) console.log(err)
				expect(res.body.friendList.length).to.equal(0);
				done();
			});
		});
	});

	describe('POST /ip/{userId}', function () {
		it('should receive 201 code when successful', function (done) {
			request(url)
			.post('/ip/johan123')
			.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmV0')
			.send('{"ip": "192.168.0.1"}')
			.expect(201)
			.end(function (err, res) {
				if (err) console.log(err)
				done();
			});
		});
	});

	function unauthorizedTest (uri, callback) {
		request(url)
		.post(uri)
		.set('Authorization', 'Basic am9oYW4xMjM6c2VjcmVL')
		.expect(401)
		.end(function (err, res) {
			if (err) console.log(err)
			callback();
		});
	}
});
