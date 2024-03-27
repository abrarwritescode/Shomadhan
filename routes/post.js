const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const router = Router();

const Post = require('../models/post');
const Comment = require('../models/comment');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
router.get('/add-new', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  return res.render('addPost', {
    user: req.user,
  });
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({ postId: req.params.id }).populate(
    'createdBy'
  );

  console.log(comments);
  return res.render('post', {
    user: req.user,
    post,
    comments,
  });
});

router.post('/comment/:postId', async (req, res) => {
  await Comment.create({
    content: req.body.content,
    postId: req.params.postId,
    createdBy: req.user._id,
  });
  return res.redirect(`/post/${req.params.postId}`);
});

router.post('/', upload.single('coverImage'), async (req, res) => {
  const { title, body } = req.body;
  const post = await Post.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/post/${post._id}`);
});

module.exports = router;
