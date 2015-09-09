var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('./userSchema');

passport.use(new BasicStrategy(
  function(userid, password, done) {
    User.findOne({ userId: userid }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      user.verifyPassword(password, user.password, function(err, isMatch) {
        if (err) { return done(err); }
        if (!isMatch) { return done(null, false); }
        return done(null, user);
      });
    });
}));

exports.isAuthenticated = passport.authenticate('basic', { session : false });    