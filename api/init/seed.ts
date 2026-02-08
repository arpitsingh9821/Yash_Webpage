import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb';
import { generateToken } from '../lib/auth';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const productsCollection = db.collection('products');
    const contactsCollection = db.collection('contacts');

    // Check if admin exists
    const existingAdmin = await usersCollection.findOne({ username: 'demon' });
    
    if (!existingAdmin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('yashdemon', 10);
      const token = generateToken();
      
      await usersCollection.insertOne({
        username: 'demon',
        email: 'admin@alwaysdemon.com',
        password: hashedPassword,
        isAdmin: true,
        token,
        createdAt: new Date()
      });
    }

    // Check if default products exist
    const productsCount = await productsCollection.countDocuments();
    
    if (productsCount === 0) {
      // Add default products
      await productsCollection.insertMany([
        {
          name: 'Demon Hoodie',
          description: 'Premium black hoodie with demon print. Comfortable and stylish.',
          price: 2499,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
          category: 'Clothing',
          createdAt: new Date()
        },
        {
          name: 'Dark T-Shirt',
          description: 'High quality cotton t-shirt with unique demon design.',
          price: 999,
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
          category: 'Clothing',
          createdAt: new Date()
        },
        {
          name: 'Demon Cap',
          description: 'Adjustable cap with embroidered demon logo.',
          price: 599,
          image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
          category: 'Accessories',
          createdAt: new Date()
        }
      ]);
    }

    // Check if contact settings exist
    const contacts = await contactsCollection.findOne({ type: 'settings' });
    
    if (!contacts) {
      await contactsCollection.insertOne({
        type: 'settings',
        whatsapp: '+1234567890',
        instagram: 'always_demon',
        telegram: 'always_demon',
        createdAt: new Date()
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
