require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Database = require('../util/database');
const { ObjectId } = require('mongodb');

// GET /api/forum/posts - Get all posts (public)
router.get('/posts', async (req, res) => {
  try {
    const db = Database.getDb();
    const posts = await db.collection('posts')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Error fetching posts' });
  }
});

// POST /api/forum/posts - Create new post (PROTECTED)
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const { userId, username } = req.user;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }

    if (title.length > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title must be 100 characters or less' 
      });
    }

    if (content.length > 2000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content must be 2000 characters or less' 
      });
    }

    const db = Database.getDb();
    const newPost = {
      title: title.trim(),
      content: content.trim(),
      category: category || 'General Discussion',
      author: {
        id: userId,
        username: username
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      comments: [],
      status: 'published'
    };

    const result = await db.collection('posts').insertOne(newPost);
    
    // Return the created post with the new ID
    const createdPost = {
      ...newPost,
      id: result.insertedId,
      _id: result.insertedId,
      timestamp: 'just now'
    };
    
    res.status(201).json({ 
      success: true, 
      message: 'Post created successfully!',
      post: createdPost
    });
    
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating post. Please try again.' 
    });
  }
});

// GET /api/forum/my-posts - Get current user's posts (PROTECTED)
router.get('/my-posts', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const db = Database.getDb();
    
    const userPosts = await db.collection('posts')
      .find({ 'author.id': userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, posts: userPosts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching your posts' 
    });
  }
});

// PUT /api/forum/posts/:id - Update user's own post (PROTECTED)
router.put('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const { userId } = req.user;

    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }

    const db = Database.getDb();
    
    // Check if post exists and belongs to user
    const existingPost = await db.collection('posts').findOne({
      _id: new ObjectId(id),
      'author.id': userId
    });

    if (!existingPost) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found or you do not have permission to edit it' 
      });
    }

    const updateData = {
      title: title.trim(),
      content: content.trim(),
      category: category || existingPost.category,
      updatedAt: new Date()
    };

    await db.collection('posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    res.json({ 
      success: true, 
      message: 'Post updated successfully!' 
    });

  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating post' 
    });
  }
});

// DELETE /api/forum/posts/:id - Delete user's own post (PROTECTED)
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const db = Database.getDb();
    
    // Check if post exists and belongs to user
    const existingPost = await db.collection('posts').findOne({
      _id: new ObjectId(id),
      'author.id': userId
    });

    if (!existingPost) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found or you do not have permission to delete it' 
      });
    }

    await db.collection('posts').deleteOne({
      _id: new ObjectId(id)
    });

    res.json({ 
      success: true, 
      message: 'Post deleted successfully!' 
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting post' 
    });
  }
});

module.exports = router;
