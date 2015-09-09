var assert = require('assert')
var expect = require('chai').expect
var database = require('../lib/database')
var jsonBodies = require('./jsonTestBodies')

describe('Database ip tests', function () {
	before(function (done) {
		database.clearUsers();
		addTestUsers(function () {
			done();
		});
	});

	after(function (done) {
		database.clearUsers();
		done();
	}); 

	describe('#addIpToDB()', function () {
		it('should return the ip added to the database if successfull', function (done) {
			database.addIpToDB('johan123', '192.168.0.1', function (err, entry) {
				expect(entry.ip).to.equal('192.168.0.1');
				done();
			});
		});

		it('should add the ip to the database if successfull', function (done) {
			database.addIpToDB('johan123', '192.168.0.2', function (err, obj) {
				database.findIp('johan123', function (err, entry) {
					expect(entry.ip).to.equal('192.168.0.2');
					done();
				});
			});
		});
	});

	describe('#findIp()', function () {
		it('should return the ip if found', function (done) {
			database.findIp('johan123', function (err, entry) {
				expect(entry.ip).to.equal('192.168.0.2');
				done();
			});
		});

		it('should return a Not found-error if the user is not found', function (done) {
			database.findIp('noUser', function (err, entry) {
				expect(err).to.equal('Not found');
				done();
			});
		})
	});

});

function addTestUsers (callback) {
	var testUser = jsonBodies.createTestRegisterRequest('johan', 'edeljung', 'jj@gmail.com', 'johan123');
	database.addUserToDB(testUser, function (err, user) {
		if(err) return console.log(err);
		testUser2 = jsonBodies.createTestRegisterRequest('marckus', 'sköld', 'ms@gmail.com', 'macke');
		database.addUserToDB(testUser2, function (err, user) {
			if(err) return console.log(err);
			testUser3 = jsonBodies.createTestRegisterRequest('aster', 'boter', 'ab@gmail.com', 'asterb');
			database.addUserToDB(testUser3, function (err, user) {
				if(err) return console.log(err);
				callback();
			});
		});
	});
}
