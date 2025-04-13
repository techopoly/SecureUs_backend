

const get_post = (req, res,next)=>{
    console.log('/post is hit');
    res.json({title: 'Dummy post'})
};



exports.get_post = get_post;