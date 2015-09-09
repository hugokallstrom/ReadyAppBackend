var assert = require('assert')	
var expect = require('chai').expect
var database = require('../lib/database')
var jsonBodies = require('./jsonTestBodies')

describe('Database search tests', function () {
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

	describe('#searchForUser()', function () {
		it('should return a Not found-error if no results', function (done) {	
			database.searchForUser('NoUser', function (err, obj) {
				expect(err).to.equal("Not found");
			});
			done();
		});

		it('should return an array of users if successful', function (done) {	
			database.searchForUser('123', function (err, obj) {
				var list = removeFields(obj);
				expect(list[0].userId).to.equal("johan123");
				expect(list[1].userId).to.equal("macke123");
			});
			done();
		});
	});
});

function removeFields(user) {
	for (var i = 0; i < user.length; i++) {
		user[i] = user[i].toObject();
		delete user[i].password
		delete user[i].__v
		delete user[i]._id	
	}
	return user
}