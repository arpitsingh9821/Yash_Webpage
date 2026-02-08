import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../lib/mongodb';
import { parseToken } from '../lib/auth';

const defaultProducts = [
  {
    name: 'Demon Hoodie Black',
    description: 'Premium quality black hoodie with demon graphics. Made with 100% cotton for ultimate comfort.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    category: 'Hoodies'
  },
  {
    name: 'Demon T-Shirt Red',
    description: 'Bold red t-shirt with exclusive demon artwork. Comfortable fit for everyday wear.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
    category: 'T-Shirts'
  },
  {
    name: 'Demon Cap',
    description: 'Stylish snapback cap with embroidered demon logo. One size fits all.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500',
    category: 'Accessories'
  },
  {
    name: 'Demon Jacket',
    description: 'Premium leather jacket with demon patches. Perfect for making a statement.',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    category: 'Jackets'
  }
];

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

    // Initialize default products if collection is empty
    const count = await productsCollection.countDocuments();
    if (count === 0) {
      await productsCollection.insertMany(defaultProducts.map(p => ({ ...p, createdAt: new Date() })));
    }

    // GET - Fetch all products
    if (req.method === 'GET') {
      const products = await productsCollection.find({}).toArray();
      return res.status(200).json({
        products: products.map(p => ({
          id: p._id.toString(),
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image,
          category: p.category
        }))
      });
    }

    // POST - Create new product (admin only)
    if (req.method === 'POST') {
      const tokenPayload = parseToken(req.headers.authorization);
      if (!tokenPayload || !tokenPayload.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { name, description, price, image, category } = req.body;
      
      if (!name || !description || !price || !image || !category) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const result = await productsCollection.insertOne({
        name,
        description,
        price: Number(price),
        image,
        category,
        createdAt: new Date()
      });

      return res.status(201).json({
        message: 'Product created successfully',
        product: {
          id: result.insertedId.toString(),
          name,
          description,
          price: Number(price),
          image,
          category
        }
      });
    }

    // PUT - Update product (admin only)
    if (req.method === 'PUT') {
      const tokenPayload = parseToken(req.headers.authorization);
      if (!tokenPayload || !tokenPayload.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { id, name, description, price, image, category } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price) updateData.price = Number(price);
      if (image) updateData.image = image;
      if (category) updateData.category = category;

      await productsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      return res.status(200).json({ message: 'Product updated successfully' });
    }

    // DELETE - Delete product (admin only)
    if (req.method === 'DELETE') {
      const tokenPayload = parseToken(req.headers.authorization);
      if (!tokenPayload || !tokenPayload.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      await productsCollection.deleteOne({ _id: new ObjectId(id) });

      return res.status(200).json({ message: 'Product deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Products error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
