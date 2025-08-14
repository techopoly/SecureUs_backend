require('dotenv').config();
const bcrypt = require('bcrypt');
const Database = require('../util/database');
const jwt = require('jsonwebtoken');

class User {
  // Find user by email in database
  static async findByEmail(email) {
    const db = Database.getDb();
    return db.collection('users').findOne({ email });
  }

  // Find user by username
  static async findByUsername(username) {
    const db = Database.getDb();
    return db.collection('users').findOne({ username });
  }

  // Create new user with hashed password
  static async createUser(username, email, password) {
    const db = Database.getDb();
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    return result.insertedId;
  }

  // Validate user login credentials
  static async validateUser(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return user;
  }

  // Generate JWT token for authenticated user
  static generateToken(user) {
    return jwt.sign(
      { 
        userId: user._id.toString(), 
        username: user.username,
        email: user.email 
      },
      process.env.JWT_SECRET, // ✅ Correct usage from .env
      { expiresIn: '7d' }
    );
  }

  // Verify if JWT token is valid
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET); // ✅ Fixed
    } catch (err) {
      return null;
    }
  }
}

module.exports = User;
