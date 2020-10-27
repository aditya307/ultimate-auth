const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: '1091310501285646',
      clientSecret: 'd3cbf8df4685f0af236dcef9a408fe73',
      callbackURL: '/login/facebook/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      // console.log(accessToken);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
