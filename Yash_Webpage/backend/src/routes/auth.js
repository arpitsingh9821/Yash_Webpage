import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readDatabase, writeDatabase } from '../config/database.js';
import { generateToken, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/signup - Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const db = readDatabase();

    // Check if username already exists
    if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ error: 'Username already taken. Please choose a different one.' });
    }

    // Check if email already exists
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Email already registered. Please login or use a different email.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user', // Default role is user, not admin
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDatabase(db);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const db = readDatabase();

    // Find user by username or email
    const user = db.users.find(
      u => u.username.toLowerCase() === username.toLowerCase() || 
           u.email.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/verify - Verify token and get user info
router.get('/verify', verifyToken, (req, res) => {
  const db = readDatabase();
  const user = db.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// GET /api/auth/users - Get all users (Admin only - for demo)
router.get('/users', verifyToken, (req, res) => {
  const db = readDatabase();
  const user = db.users.find(u => u.id === req.user.id);

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const users = db.users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
  }));

  res.json({ users });
});

export default router;
