const express = require('express');

const router = express.Router();
const post_controller = require('../controller/post_controller');


router.get('/posts', post_controller.get_post);
// router.get('/posts/:id', post_controller.get_post_by_id);
router.post('/posts/create', post_controller.create_post);
// router.post('/post/comment/:id', post_controller.create_comment);
// router.post('/post/like/:id', post_controller.like_post);
// router.post('/post/commnet/reply/:id', post_controller.reply_comment);

module.exports = router;