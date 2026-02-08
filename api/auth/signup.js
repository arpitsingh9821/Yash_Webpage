const { connectToDatabase } = require('../lib/mongodb');
const { generateToken, hashPassword } = require('../lib/auth');

module.exports = async function handler(req, res) {
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
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if username already exists
    const existingUser = await usersCollection.findOne({ 
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create new user
    const token = generateToken();
    const hashedPassword = hashPassword(password);

    const newUser = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      token: token,
      isAdmin: false,
      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);

    return res.status(201).json({
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        isAdmin: false
      },
      token: token
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
