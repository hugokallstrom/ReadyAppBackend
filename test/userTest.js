var assert = require('assert')	
var expect = require('chai').expect
var database = require('../lib/database')
var jsonBodies = require('./jsonTestBodies')

describe('Database user tests', function () {
	before(function (done) {
		var testUser = jsonBodies.createTestRegisterRequest('Johan', 'Edeljung', 'johanede@gmail.com', 'johan123');
		database.addUserToDB(testUser, function (err, user) {
			if(err) return console.log(err);
		});
		done();
	});

	after(function (done) {
		database.clearUsers();
		done();
	}); 

	describe('#findUser()', function () {
		it('should return a null object if the user not exists', function (done) {	
			database.findUser('noUser', function (err, obj) {
				expect(obj).to.equal(null);
			});
			done();
		});

		it('should return error "Not found" if the user not exists', function (done) {
			database.findUser('noUser', function (err, obj) {
				expect(err).to.equal('Not found');
			});
			done();
		});

		it('should return user information if user is found', function (done) {
			database.findUser('johan123', function (err, obj) {
				user = obj.toObject();
				expect(user.name).to.equal('Johan');
				expect(user.lastName).to.equal('Edeljung');
				expect(user.email).to.equal('johanede@gmail.com');
				expect(user.userId).to.equal('johan123');
			});
			done();
		});

	});

	describe('#addUserToDB()', function () {
		it('should return a null object if the user name already exists', function (done) {
			var testUser = jsonBodies.createTestRegisterRequest('Johan', 'Edeljung', 'johanede@gmail.com', 'johan123');
			database.addUserToDB(testUser, function (err, obj) {
				expect(obj).to.equal(null);
			});
			done();
		});

		it('should return "user exists"-error if the user name already exists', function (done) {
			var testUser = jsonBodies.createTestRegisterRequest('Johan', 'Edeljung', 'johanede@gmail.com', 'johan123');
			database.addUserToDB(testUser, function (err, obj) {
				expect(err).to.equal('User exists');
			});
			done();
		});

		it('should return the user if successfully added', function (done) {
			var testUser = jsonBodies.createTestRegisterRequest('Markus', 'Sköld', 'mack@gmail.com', 'macke');
			database.addUserToDB(testUser, function (err, obj) {
				user = obj.toObject();
				expect(user.name).to.equal('Markus');
				expect(user.lastName).to.equal('Sköld');
				expect(user.email).to.equal('mack@gmail.com');
				expect(user.userId).to.equal('macke');
			});
			done();
		});
	});

});

