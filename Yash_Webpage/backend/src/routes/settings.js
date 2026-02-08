import express from 'express';
import { readDatabase, writeDatabase } from '../config/database.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings/contact - Get contact settings (Public)
router.get('/contact', (req, res) => {
  try {
    const db = readDatabase();
    res.json({ contactSettings: db.contactSettings });
  } catch (error) {
    console.error('Get contact settings error:', error);
    res.status(500).json({ error: 'Failed to fetch contact settings.' });
  }
});

// PUT /api/settings/contact - Update contact settings (Admin only)
router.put('/contact', verifyToken, isAdmin, (req, res) => {
  try {
    const { whatsapp, instagram, telegram } = req.body;
    const db = readDatabase();

    db.contactSettings = {
      whatsapp: whatsapp || db.contactSettings.whatsapp,
      instagram: instagram || db.contactSettings.instagram,
      telegram: telegram || db.contactSettings.telegram,
    };

    writeDatabase(db);

    res.json({
      message: 'Contact settings updated successfully!',
      contactSettings: db.contactSettings,
    });
  } catch (error) {
    console.error('Update contact settings error:', error);
    res.status(500).json({ error: 'Failed to update contact settings.' });
  }
});

export default router;
