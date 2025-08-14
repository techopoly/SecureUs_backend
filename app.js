// Load environment variables at the very top
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

// Import your routes
const ForumRoutes = require('./routes/forum');
const UserRoutes = require('./routes/user_route');
const AuthRoutes = require('./routes/auth'); // NEW AUTH ROUTES
const Database = require('./util/database');
const AppointmentRoutes = require('./routes/appointment');
const app = express();



app.use(cors({
    origin: [
      'http://localhost:5173',  // Keep for local development
      'https://techopoly.github.io' // Add your GitHub Pages domain
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database and start server
Database.mongoConnect(() => {
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });
});

// Routes
app.use('/api/auth', AuthRoutes); // Authentication routes (public)
app.use('/api/forum', ForumRoutes); // Forum routes (will be protected)
app.use('/api/user', UserRoutes); // User routes
app.use('/api/appointments', AppointmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
}); 
