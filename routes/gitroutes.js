const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/');
    const user = req.user;
    jwt.sign({ user: user }, 'secretkey', (err, token) => {
      if (err) {
        throw err;
      } else {
        console.log(user);
        console.log(token);
        res.send(token);
      }
    });
  }
);

module.exports = router;
