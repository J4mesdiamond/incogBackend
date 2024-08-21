const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://ufuomararuvwe:ufuoma123@cluster0.qdmkh.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Create a schema and model for the emails
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});

const Email = mongoose.model('Email', emailSchema);

// Endpoint to handle email subscriptions
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    if (error.code === 11000) { // Duplicate email error
      res.status(409).json({ success: false, message: 'Email is already subscribed' });
    } else {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

// Handle database connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
