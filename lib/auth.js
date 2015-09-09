var passport = require('passport')
var FacebookTokenStrategy = require('passport-facebook-token').Strategy

passport.use(new FacebookTokenStrategy({
				clientID: '469773603205380',
				clientSecret: '7066a2fa349f51fc520d5a4e531cff58',
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOrCreate({ facebookId: profile.id }, function (err, user) {
				return done(err, user);
 			});
		}
));

exports.isAuthenticated = passport.authenticate('facebook-token');
