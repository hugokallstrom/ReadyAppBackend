var passport = require('passport')
var FacebookTokenStrategy = require('passport-facebook-token').Strategy

passport.use(new FacebookTokenStrategy({
				clientID: '129998764015121',
				clientSecret: '59ea459a9028b90d0af59d00d2852c4e',
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOrCreate({ facebookId: profile.id }, function (err, user) {
				return done(err, user);
 			});
		}
));

exports.isAuthenticated = passport.authenticate('facebook-token');
