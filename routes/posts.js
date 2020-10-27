const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
});

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ date: -1 });
    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      err: 'Server Eror',
    });
  }
});

router.post('/', auth, upload.single('posts'), async (req, res) => {
  try {
    const { caption, image } = req.body;
    const newPost = new Post({
      caption,
      image,
      user: req.user.id,
    });
    const post = await newPost.save();
    console.log(post.image);
    console.log(post);
    return res.status(200).json({
      success: true,
      data: post,
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
