const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { genRandPass } = require('../utils');
const bcrypt = require('bcryptjs');
const Otp = require('../models/Otp');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

//Tranaspoter
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'akhlesh.6985@gmail.com',
    pass: 'nitinyadav',
  },
});


router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ msg: 'user exists' });
    } else {
      let password = genRandPass();
      console.log(`password: ${password}`);
      const tempPass = genRandPass();

      let mailInfo = await transporter.sendMail({
        from: 'adi.2002.gwl@gmail.com',
        to: email,
        subject: 'Your password for login is',
        html: `<p> Password: <b>${tempPass}</b></p>`,
      });
      console.log('Message Sent: %s', mailInfo.messageId);

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(tempPass, salt);

      const user = new User({
        name,
        email,
        password,
      });
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, 'secretkey', (err, token) => {
        if (err) {
          throw err;
        }
        return res.status(200).json({
          success: true,
          data: user,
        });
      });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post('/changepass', auth, async (req, res) => {
  const { _id, newPass, oldPass } = req.body;
  let user = await User.findById(_id);
  if (user) {
    const verified = await bcrypt.compare(oldPass, user.password);
    if (verified) {
      const salt = await bcrypt.genSalt(10);
      const newPassSave = await bcrypt.hash(newPass, salt);
      const updated = await User.findByIdAndUpdate(_id, {
        password: newPassSave,
      });
      res.status(200).json({
        suceess: true,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Incorrect Password',
      });
    }
  } else {
    res.status(400).json({
      success: false,
      err: 'User DNE',
    });
  }
});

router.post('/forgot/initial', async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    let OtpStr = Math.floor(100000 + Math.random() * 900000);
    console.log(OtpStr);
    const dt = new Date();
    const otp = new Otp({
      userId: user.id,
      OtpStr: OtpStr,
      date: dt,
    });
    console.log(otp.OtpStr);
    otp.save();
    let mailInfo = await transporter.sendMail({
      from: 'adi.2002.gwl@gmail.com',
      to: email,
      subject: 'Your OTP',
      html: `<p> Your OTP is <b> ${otp.OtpStr}</b>, for 5 min </p>`,
    });
    res.status(200).json({
      success: true,
      _id: user.id,
    });
    console.log('Message sent : %s', mailInfo.messageId);
  }
});

router.post('/forgot/verify', async (req, res) => {
  const { OtpStr, _id, email } = req.body;
  const otp = await Otp.findOne({ userId: _id, OtpStr });
  const timeNow = new Date();
  const otpTime = new Date(otp.date);
  let timeDiff = timeNow - otpTime;
  console.log(timeDiff);
  if (timeDiff < 5 * 60 * 1000 && OtpStr === otp.OtpStr) {
    const newPass = genRandPass();
    const salt = await bcrypt.genSalt(10);
    const newPassSave = await bcrypt.hash(newPass, salt);
    const updated = await await User.findByIdAndUpdate(
      _id,
      { password: newPassSave },
      { useFindAndModify: false }
    );
    let mailInfo = await transporter.sendMail({
      from: 'adi.2002.gwl@gmail.com',
      to: email,
      subject: 'Your New Password',
      html: `<p> Your new password is <b> ${newPass}</b>, for 5 min </p>`,
    });
    console.log('Message sent : %s', mailInfo.messageId);
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
      err: 'invalid/expired OTP',
    });
  }
});

module.exports = router;
