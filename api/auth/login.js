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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find user by username
    const hashedPassword = hashPassword(password);
    const user = await usersCollection.findOne({ 
      username: username.toLowerCase(),
      password: hashedPassword
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate new token
    const token = generateToken();
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { token: token } }
    );

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin || false
      },
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
