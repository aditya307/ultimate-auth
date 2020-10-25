const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  OtpStr: {
    type: String,
  },
});
module.exports = mongoose.model('otp', OtpSchema);
