const { connectToDatabase } = require('./lib/mongodb');
const { hashPassword, generateToken } = require('./lib/auth');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    
    // Create admin user if not exists
    const usersCollection = db.collection('users');
    const existingAdmin = await usersCollection.findOne({ username: 'demon' });

    if (!existingAdmin) {
      await usersCollection.insertOne({
        username: 'demon',
        email: 'admin@alwaysdemon.com',
        password: hashPassword('yashdemon'),
        token: generateToken(),
        isAdmin: true,
        createdAt: new Date()
      });
    }

    // Create default contacts if not exists
    const contactsCollection = db.collection('contacts');
    const existingContacts = await contactsCollection.findOne({ type: 'main' });

    if (!existingContacts) {
      await contactsCollection.insertOne({
        type: 'main',
        whatsapp: '919876543210',
        instagram: 'alwaysdemon',
        telegram: 'alwaysdemon'
      });
    }

    // Create sample products if none exist
    const productsCollection = db.collection('products');
    const productCount = await productsCollection.countDocuments();

    if (productCount === 0) {
      await productsCollection.insertMany([
        {
          name: 'Demon Hoodie',
          description: 'Premium quality hoodie with demon logo',
          price: 1999,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
          category: 'Clothing',
          createdAt: new Date()
        },
        {
          name: 'Demon Cap',
          description: 'Stylish cap with embroidered demon logo',
          price: 599,
          image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
          category: 'Accessories',
          createdAt: new Date()
        },
        {
          name: 'Demon T-Shirt',
          description: 'Comfortable cotton t-shirt with demon print',
          price: 799,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          category: 'Clothing',
          createdAt: new Date()
        }
      ]);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });

  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: 'Failed to initialize database' });
  }
};
