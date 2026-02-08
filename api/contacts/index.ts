import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb';
import { extractToken } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const contactsCollection = db.collection('contacts');

    // GET - Fetch contact settings (public)
    if (req.method === 'GET') {
      let contacts = await contactsCollection.findOne({ type: 'settings' });
      
      // Initialize default contacts if not exists
      if (!contacts) {
        const defaultContacts = {
          type: 'settings',
          whatsapp: '+1234567890',
          instagram: 'always_demon',
          telegram: 'always_demon'
        };
        await contactsCollection.insertOne(defaultContacts);
        contacts = defaultContacts;
      }

      return res.status(200).json({
        whatsapp: contacts.whatsapp,
        instagram: contacts.instagram,
        telegram: contacts.telegram
      });
    }

    // PUT - Update contact settings (admin only)
    if (req.method === 'PUT') {
      const token = extractToken(req.headers.authorization);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ token });
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { whatsapp, instagram, telegram } = req.body;

      await contactsCollection.updateOne(
        { type: 'settings' },
        { $set: { whatsapp, instagram, telegram, updatedAt: new Date() } },
        { upsert: true }
      );

      return res.status(200).json({ whatsapp, instagram, telegram });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Contacts API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
