const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GitUserSchema = new Schema({
  gitId: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
  },
  image: {
    type: String,
  },
  Created_At: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('gitusers', GitUserSchema);
