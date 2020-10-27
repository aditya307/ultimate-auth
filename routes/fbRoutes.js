const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

module.exports = router;
