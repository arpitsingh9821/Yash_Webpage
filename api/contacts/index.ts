import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb';
import { parseToken } from '../lib/auth';

const defaultContacts = {
  whatsapp: '919876543210',
  instagram: 'always.demon',
  telegram: 'alwaysdemon'
};

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
    const settingsCollection = db.collection('settings');

    // Initialize default contacts if not exists
    const existingContacts = await settingsCollection.findOne({ type: 'contacts' });
    if (!existingContacts) {
      await settingsCollection.insertOne({ type: 'contacts', ...defaultContacts, createdAt: new Date() });
    }

    // GET - Fetch contacts
    if (req.method === 'GET') {
      const contacts = await settingsCollection.findOne({ type: 'contacts' });
      return res.status(200).json({
        contacts: {
          whatsapp: contacts?.whatsapp || defaultContacts.whatsapp,
          instagram: contacts?.instagram || defaultContacts.instagram,
          telegram: contacts?.telegram || defaultContacts.telegram
        }
      });
    }

    // PUT - Update contacts (admin only)
    if (req.method === 'PUT') {
      const tokenPayload = parseToken(req.headers.authorization);
      if (!tokenPayload || !tokenPayload.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { whatsapp, instagram, telegram } = req.body;

      await settingsCollection.updateOne(
        { type: 'contacts' },
        { 
          $set: { 
            whatsapp: whatsapp || defaultContacts.whatsapp,
            instagram: instagram || defaultContacts.instagram,
            telegram: telegram || defaultContacts.telegram,
            updatedAt: new Date()
          } 
        },
        { upsert: true }
      );

      return res.status(200).json({ message: 'Contacts updated successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Contacts error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
