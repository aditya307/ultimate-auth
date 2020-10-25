const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GitUser = require('./models/GitUser');

passport.use(
  new GitHubStrategy(
    {
      clientID: '73d6c25729dca1cf83f8',
      clientSecret: 'ac4b6bff9af20c5e9f26a8391a7cd4807eeea63a',
      callbackURL: '/login/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile);

      const newUser = {
        gitId: profile.id,
        Name: profile.displayName,
        username: profile.username,
        profileUrl: profile.profileUrl,
        image: profile.photos[0].value,
      };
      try {
        let user = await GitUser.findOne({ gitId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await GitUser.create(newUser);
          done(null, user);
          console.log('############  New USer Created %%%%%%%%%%%%%%%');
        }
      } catch (err) {
        console.log(err);
      }
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
