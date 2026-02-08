import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb';
import { extractToken } from '../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const inquiriesCollection = db.collection('inquiries');
    const usersCollection = db.collection('users');

    // POST - Create inquiry (public - when user clicks contact)
    if (req.method === 'POST') {
      const { productId, productName, platform, username } = req.body;

      const result = await inquiriesCollection.insertOne({
        productId,
        productName,
        platform,
        username: username || 'Guest',
        createdAt: new Date()
      });

      return res.status(201).json({
        id: result.insertedId.toString(),
        productId,
        productName,
        platform,
        username: username || 'Guest',
        createdAt: new Date().toISOString()
      });
    }

    // GET and DELETE require admin auth
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await usersCollection.findOne({ token });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // GET - Fetch all inquiries (admin only)
    if (req.method === 'GET') {
      const inquiries = await inquiriesCollection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(inquiries.map(i => ({
        id: i._id.toString(),
        productId: i.productId,
        productName: i.productName,
        platform: i.platform,
        username: i.username,
        createdAt: i.createdAt
      })));
    }

    // DELETE - Delete inquiry
    if (req.method === 'DELETE') {
      const { id } = req.body;
      
      await inquiriesCollection.deleteOne({ _id: new ObjectId(id) });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Inquiries API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
