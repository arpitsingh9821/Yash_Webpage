const { connectToDatabase } = require('./lib/mongodb');

module.exports = async function handler(req, res) {
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

    // GET - Fetch contact settings
    if (req.method === 'GET') {
      let contacts = await contactsCollection.findOne({ type: 'main' });

      if (!contacts) {
        // Create default contacts
        contacts = {
          type: 'main',
          whatsapp: '919876543210',
          instagram: 'alwaysdemon',
          telegram: 'alwaysdemon'
        };
        await contactsCollection.insertOne(contacts);
      }

      return res.status(200).json({
        whatsapp: contacts.whatsapp,
        instagram: contacts.instagram,
        telegram: contacts.telegram
      });
    }

    // PUT - Update contact settings
    if (req.method === 'PUT') {
      const { whatsapp, instagram, telegram } = req.body;

      await contactsCollection.updateOne(
        { type: 'main' },
        { 
          $set: { 
            whatsapp: whatsapp || '',
            instagram: instagram || '',
            telegram: telegram || ''
          } 
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Contacts API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
