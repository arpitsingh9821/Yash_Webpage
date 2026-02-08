import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../lib/mongodb';
import { parseToken } from '../lib/auth';

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

    // GET - Fetch all inquiries (admin only)
    if (req.method === 'GET') {
      const tokenPayload = parseToken(req.headers.authorization);
      if (!tokenPayload || !tokenPayload.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const inquiries = await inquiriesCollection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({
        inquiries: inquiries.map(i => ({
          id: i._id.toString(),
          productName: i.productName,
          customerName: i.customerName,
          platform: i.platform,
          timestamp: i.createdAt
        }))
      });
    }

    // POST - Create new inquiry
    if (req.method === 'POST') {
      const { productName, customerName, platform } = req.body;
      
      if (!productName || !platform) {
        return res.status(400).json({ error: 'Product name and platform are required' });
      }

      const result = await inquiriesCollection.insertOne({
        productName,
        customerName: customerName || 'Anonymous',
        platform,
        createdAt: new Date()
      });

      return res.status(201).json({
        message: 'Inquiry recorded successfully',
        inquiry: {
          id: result.insertedId.toString(),
          productName,
          customerName: customerName || 'Anonymous',
          platform,
          timestamp: new Date()
        }
      });
    }

    // DELETE - Delete inquiry (admin only)
    if (req.method === 'DELETE') {
      const tokenPayload = parseToken(req.headers.authorization);
      if (!tokenPayload || !tokenPayload.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Inquiry ID is required' });
      }

      await inquiriesCollection.deleteOne({ _id: new ObjectId(id) });

      return res.status(200).json({ message: 'Inquiry deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Inquiries error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
