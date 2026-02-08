const { connectToDatabase } = require('./lib/mongodb');
const { ObjectId } = require('mongodb');

module.exports = async function handler(req, res) {
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

    // GET - Fetch all products
    if (req.method === 'GET') {
      const products = await productsCollection.find({}).toArray();
      const formattedProducts = products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category
      }));
      return res.status(200).json(formattedProducts);
    }

    // POST - Add new product
    if (req.method === 'POST') {
      const { name, description, price, image, category } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
      }

      const newProduct = {
        name,
        description: description || '',
        price: Number(price),
        image: image || 'https://via.placeholder.com/300x200?text=Product',
        category: category || 'General',
        createdAt: new Date()
      };

      const result = await productsCollection.insertOne(newProduct);

      return res.status(201).json({
        id: result.insertedId.toString(),
        ...newProduct
      });
    }

    // PUT - Update product
    if (req.method === 'PUT') {
      const { id, name, description, price, image, category } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = Number(price);
      if (image) updateData.image = image;
      if (category) updateData.category = category;

      await productsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      return res.status(200).json({ success: true });
    }

    // DELETE - Delete product
    if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      await productsCollection.deleteOne({ _id: new ObjectId(id) });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
