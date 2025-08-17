require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Database = require('../util/database');
const { ObjectId } = require('mongodb');

// Get all appointments for the logged-in user
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const db = Database.getDb();
    const userId = req.user.userId;
    const appointments = await db.collection('appointments')
      .find({ userId: new ObjectId(userId) })
      .sort({ date: 1 })
      .toArray();
    
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments' });
  }
});

// Book an appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = Database.getDb();
    const { slotId, date, time } = req.body;
    const userId = req.user.userId;

    // Check if slot is already booked by this user
    const existing = await db.collection('appointments').findOne({ userId: new ObjectId(userId), slotId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already booked this slot' });
    }

    const appointment = {
      slotId,
      userId: new ObjectId(userId),
      username: req.user.username,
      email: req.user.email,
      date,
      time,
      createdAt: new Date()
    };

    await db.collection('appointments').insertOne(appointment);

    res.json({ success: true, message: 'Appointment booked successfully', appointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ success: false, message: 'Error booking appointment' });
  }
});

module.exports = router;
