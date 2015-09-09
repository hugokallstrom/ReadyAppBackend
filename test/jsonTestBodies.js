exports.createTestRegisterRequest = function (name, lastName, email, userId) {
	return json = {
		'name': name, 
		'lastName': lastName,
		'email': email,
		'userId': userId,
		'password': 'secret'
	}
}

exports.createTestUserResponse = function () {
	return json = {
		'userId': 'johan123',
		'name': 'Johan',
		'lastName': 'Edeljung',
		'email': 'johanede@gmail.com',
		'userId': 'johan123',
		'profilePicture': 'Not specified',
		'friendList:': [{'userId': 'Not specified'}],
		'lastOnline': 'Never',
		'yourFriend': false
	}
}

