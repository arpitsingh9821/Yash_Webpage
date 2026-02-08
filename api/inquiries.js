const { connectToDatabase } = require('./lib/mongodb');
const { ObjectId } = require('mongodb');

module.exports = async function handler(req, res) {
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

    // GET - Fetch all inquiries
    if (req.method === 'GET') {
      const inquiries = await inquiriesCollection.find({}).sort({ timestamp: -1 }).toArray();
      const formattedInquiries = inquiries.map(i => ({
        id: i._id.toString(),
        productName: i.productName,
        platform: i.platform,
        timestamp: i.timestamp
      }));
      return res.status(200).json(formattedInquiries);
    }

    // POST - Add new inquiry
    if (req.method === 'POST') {
      const { productName, platform } = req.body;

      const newInquiry = {
        productName,
        platform,
        timestamp: new Date().toISOString()
      };

      const result = await inquiriesCollection.insertOne(newInquiry);

      return res.status(201).json({
        id: result.insertedId.toString(),
        ...newInquiry
      });
    }

    // DELETE - Delete inquiry
    if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Inquiry ID is required' });
      }

      await inquiriesCollection.deleteOne({ _id: new ObjectId(id) });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Inquiries API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
