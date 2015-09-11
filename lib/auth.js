var passport = require('passport')
var database = require('./database.js')
var User = require('./userSchema.js')
var FacebookTokenStrategy = require('passport-facebook-token').Strategy

passport.use(new FacebookTokenStrategy({
			clientID: '129998764015121',
			clientSecret: '59ea459a9028b90d0af59d00d2852c4e',
			profileFields: ['id', 'email', 'gender', 'locale', 'name'],
	},
	function(accessToken, refreshToken, profile, done) {
		console.log("Profile: " + profile);
		User.findOne({ userId: profile.userId }, function(err, user) {
			if(err) return done(err);
			if(!user) database.addUserToDB(profile);
			return done(null, user);
		});
	}
));

exports.isAuthenticated = passport.authenticate('facebook-token', { scope: ['email'] });
