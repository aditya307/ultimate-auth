const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  caption: {
    type: String,
  },
  Uploaded_At: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('posts', PostSchema);
