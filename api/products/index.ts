import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb';
import { extractToken } from '../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');
    const usersCollection = db.collection('users');

    // GET - Fetch all products (public)
    if (req.method === 'GET') {
      const products = await productsCollection.find({}).toArray();
      return res.status(200).json(products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category
      })));
    }

    // For POST, PUT, DELETE - require admin auth
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await usersCollection.findOne({ token });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // POST - Create product
    if (req.method === 'POST') {
      const { name, description, price, image, category } = req.body;
      
      const result = await productsCollection.insertOne({
        name,
        description,
        price,
        image,
        category,
        createdAt: new Date()
      });

      return res.status(201).json({
        id: result.insertedId.toString(),
        name,
        description,
        price,
        image,
        category
      });
    }

    // PUT - Update product
    if (req.method === 'PUT') {
      const { id, name, description, price, image, category } = req.body;
      
      await productsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, description, price, image, category, updatedAt: new Date() } }
      );

      return res.status(200).json({
        id,
        name,
        description,
        price,
        image,
        category
      });
    }

    // DELETE - Delete product
    if (req.method === 'DELETE') {
      const { id } = req.body;
      
      await productsCollection.deleteOne({ _id: new ObjectId(id) });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
