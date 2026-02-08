import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_PATH, 'database.json');

// Default data
const defaultData = {
  users: [],
  products: [
    {
      id: '1',
      name: 'Demon Hoodie',
      description: 'Premium quality black hoodie with demon print. Made with 100% cotton for ultimate comfort.',
      price: '$59.99',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
      category: 'Clothing',
    },
    {
      id: '2',
      name: 'Dark Soul T-Shirt',
      description: 'Exclusive design t-shirt featuring unique demon artwork. Limited edition.',
      price: '$34.99',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      category: 'Clothing',
    },
    {
      id: '3',
      name: 'Demon Cap',
      description: 'Stylish cap with embroidered demon logo. Adjustable strap for perfect fit.',
      price: '$24.99',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
      category: 'Accessories',
    },
    {
      id: '4',
      name: 'Shadow Jacket',
      description: 'Lightweight jacket perfect for any season. Water-resistant material.',
      price: '$89.99',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      category: 'Clothing',
    },
  ],
  contactSettings: {
    whatsapp: '+1234567890',
    instagram: 'always_demon',
    telegram: 'always_demon',
  },
  inquiries: [],
};

// Initialize database
const initDatabase = async () => {
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('yashdemon', 10);
    defaultData.users.push({
      id: uuidv4(),
      username: 'demon',
      email: 'admin@alwaysdemon.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    console.log('📦 Database initialized with default data');
  }
};

// Read database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return defaultData;
  }
};

// Write database
const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// Initialize on import
initDatabase();

export { readDatabase, writeDatabase, initDatabase };
