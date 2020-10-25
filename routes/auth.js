const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      err: 'Server Error',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ msg: 'invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(404).json({
        msg: 'invalid Credentials',
      });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, 'secretkey', (err, token) => {
      if (err) {
        throw err;
      }
      res.json({
        success: true,
        token: token,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      err: 'Server Error',
    });
  }
});

module.exports = router;
