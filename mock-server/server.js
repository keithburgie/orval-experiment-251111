const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const users = {
  '1': {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1-555-123-4567',
    bio: 'Software engineer passionate about building great user experiences.',
  },
  '2': {
    id: '2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: null,
    bio: 'Product designer who loves creating intuitive interfaces.',
  },
  '3': {
    id: '3',
    email: 'bob.wilson@example.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    phoneNumber: '+1-555-987-6543',
    bio: null,
  },
};

// Helper function to simulate delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// GET /api/users/:userId
app.get('/api/users/:userId', async (req, res) => {
  try {
    // Simulate network delay
    await delay(500);

    const { userId } = req.params;
    const user = users[userId];

    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// PUT /api/users/:userId
app.put('/api/users/:userId', async (req, res) => {
  try {
    // Simulate network delay
    await delay(800);

    const { userId } = req.params;
    const user = users[userId];

    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      });
    }

    const { email, firstName, lastName, phoneNumber, bio } = req.body;

    // Validation
    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        message: 'Email, firstName, and lastName are required fields',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
      });
    }

    // Update user
    users[userId] = {
      ...user,
      email,
      firstName,
      lastName,
      phoneNumber: phoneNumber || null,
      bio: bio || null,
    };

    res.json(users[userId]);
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/api/users/:userId`);
  console.log(`  PUT  http://localhost:${PORT}/api/users/:userId`);
  console.log(`\nSample user IDs: 1, 2, 3`);
});
