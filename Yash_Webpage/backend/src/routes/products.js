import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDatabase, writeDatabase } from '../config/database.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products - Get all products (Public)
router.get('/', (req, res) => {
  try {
    const db = readDatabase();
    res.json({ products: db.products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// GET /api/products/:id - Get single product (Public)
router.get('/:id', (req, res) => {
  try {
    const db = readDatabase();
    const product = db.products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

// POST /api/products - Create a product (Admin only)
router.post('/', verifyToken, isAdmin, (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }

    const db = readDatabase();

    const newProduct = {
      id: uuidv4(),
      name,
      description: description || '',
      price,
      image: image || 'https://via.placeholder.com/400',
      category: category || 'General',
      createdAt: new Date().toISOString(),
    };

    db.products.push(newProduct);
    writeDatabase(db);

    res.status(201).json({
      message: 'Product created successfully!',
      product: newProduct,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// PUT /api/products/:id - Update a product (Admin only)
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const db = readDatabase();

    const productIndex = db.products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    db.products[productIndex] = {
      ...db.products[productIndex],
      name: name || db.products[productIndex].name,
      description: description !== undefined ? description : db.products[productIndex].description,
      price: price || db.products[productIndex].price,
      image: image || db.products[productIndex].image,
      category: category || db.products[productIndex].category,
      updatedAt: new Date().toISOString(),
    };

    writeDatabase(db);

    res.json({
      message: 'Product updated successfully!',
      product: db.products[productIndex],
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id - Delete a product (Admin only)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const db = readDatabase();
    const productIndex = db.products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const deletedProduct = db.products.splice(productIndex, 1)[0];
    writeDatabase(db);

    res.json({
      message: 'Product deleted successfully!',
      product: deletedProduct,
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

export default router;
