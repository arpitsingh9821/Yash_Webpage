import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../lib/mongodb';
import { generateToken } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      if (existingUser.username === username.toLowerCase()) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if this is the admin account
    const isAdmin = username.toLowerCase() === 'demon' && password === 'yashdemon';

    // Create user
    const result = await usersCollection.insertOne({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin,
      createdAt: new Date()
    });

    // Generate token
    const token = generateToken({
      userId: result.insertedId.toString(),
      username: username.toLowerCase(),
      isAdmin
    });

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertedId.toString(),
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        isAdmin
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
