import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDatabase, writeDatabase } from '../config/database.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/inquiries - Get all inquiries (Admin only)
router.get('/', verifyToken, isAdmin, (req, res) => {
  try {
    const db = readDatabase();
    res.json({ inquiries: db.inquiries });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

// POST /api/inquiries - Create an inquiry (Public)
router.post('/', (req, res) => {
  try {
    const { productId, productName, platform, customerName } = req.body;

    if (!productId || !productName || !platform) {
      return res.status(400).json({ error: 'Product ID, name, and platform are required.' });
    }

    if (!['whatsapp', 'instagram', 'telegram'].includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform. Must be whatsapp, instagram, or telegram.' });
    }

    const db = readDatabase();

    const newInquiry = {
      id: uuidv4(),
      productId,
      productName,
      platform,
      customerName: customerName || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    db.inquiries.unshift(newInquiry);
    
    // Keep only last 100 inquiries
    if (db.inquiries.length > 100) {
      db.inquiries = db.inquiries.slice(0, 100);
    }

    writeDatabase(db);

    res.status(201).json({
      message: 'Inquiry recorded successfully!',
      inquiry: newInquiry,
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ error: 'Failed to record inquiry.' });
  }
});

// DELETE /api/inquiries/:id - Delete an inquiry (Admin only)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const db = readDatabase();
    const inquiryIndex = db.inquiries.findIndex(i => i.id === req.params.id);

    if (inquiryIndex === -1) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    db.inquiries.splice(inquiryIndex, 1);
    writeDatabase(db);

    res.json({ message: 'Inquiry deleted successfully!' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
});

// DELETE /api/inquiries - Clear all inquiries (Admin only)
router.delete('/', verifyToken, isAdmin, (req, res) => {
  try {
    const db = readDatabase();
    db.inquiries = [];
    writeDatabase(db);

    res.json({ message: 'All inquiries cleared successfully!' });
  } catch (error) {
    console.error('Clear inquiries error:', error);
    res.status(500).json({ error: 'Failed to clear inquiries.' });
  }
});

export default router;
