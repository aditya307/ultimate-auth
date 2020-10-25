const express = require('express');
const bodyPraser = require('body-parser');
const connectDB = require('./db');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const passport = require('passport');
const fbauth = require('./routes/fbRoutes');
const gitauth = require('./routes/gitroutes');
const users = require('./routes/users');
const posts = require('./routes/posts');
const auth = require('./routes/auth');

require('./gitpassport');

connectDB();
const app = express();

app.use(morgan('dev'));
app.use(bodyPraser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/login', gitauth);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server runnning on ${PORT}`);
});
