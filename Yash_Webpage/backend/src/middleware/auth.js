import jwt from 'jsonwebtoken';
import { readDatabase } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'always-demon-super-secret-key-2024';

// Verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const db = readDatabase();
  const user = db.users.find(u => u.id === req.user.id);

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  next();
};

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export { JWT_SECRET };
