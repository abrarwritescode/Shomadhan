const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookiePaser = require('cookie-parser');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const app = express();
const PORT = 8000;
const cors = require('cors');
const Post = require('./models/post');
const {
  checkForAuthenticationCookie,
} = require('./middlewares/authentication');

mongoose
  .connect('mongodb://127.0.0.1:27017/shomadhan', {})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.static(path.resolve('./public')));

app.use(express.urlencoded({ extended: false }));

app.use(cookiePaser());
app.use(checkForAuthenticationCookie('token'));

app.get('/', async (req, res) => {
  const allPosts = await Post.find({});
  res.render('home', {
    user: req.user,
    posts: allPosts,
  });
});
app.use('/user', userRoute);
app.use('/post', postRoute);
app.listen(PORT, () => console.log(`server started at port: ${PORT}`));
