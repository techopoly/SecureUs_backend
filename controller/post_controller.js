const PostModels = require('../models/post');

const get_post = (req, res,next)=>{
    console.log('/post is hit');
    res.json({title: 'Dummy post'})
};

const create_post = (req, res, next) => {
    console.log('/post/create is hit');
    console.log(req.body);
    const id = 1;
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.author;
    // console.log(title, content, author);
    const post = new PostModels.Post(id, title, content, author);
    post.save();
    res.json({title: title, content: content, author: author});
}



exports.get_post = get_post;
exports.create_post = create_post;