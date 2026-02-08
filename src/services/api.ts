// API Service - Simulated Backend for Demo
// In production, replace localStorage calls with actual API endpoints

import { v4 as uuidv4 } from 'uuid';
import { User, Product, ContactSettings, CustomerInquiry, AuthResponse } from '../types';

// Simulated delay for realistic API feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Storage keys
const STORAGE_KEYS = {
  USERS: 'demon_users',
  PRODUCTS: 'demon_products',
  CONTACT: 'demon_contact',
  INQUIRIES: 'demon_inquiries',
  TOKEN: 'demon_token',
  CURRENT_USER: 'demon_current_user',
};

// Default data
const defaultProducts: Product[] = [
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
];

const defaultContactSettings: ContactSettings = {
  whatsapp: '+1234567890',
  instagram: 'always_demon',
  telegram: 'always_demon',
};

// Simple hash function for passwords (demo purposes - use bcrypt in production)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36) + '_' + btoa(password).slice(0, 10);
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const newHash = hashPassword(password);
  return newHash === hashedPassword;
};

// Initialize default data
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [{
      id: uuidv4(),
      username: 'demon',
      email: 'admin@alwaysdemon.com',
      password: hashPassword('yashdemon'),
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
    }];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CONTACT)) {
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(defaultContactSettings));
  }

  if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([]));
  }
};

// Initialize on load
initializeData();

// ==================== AUTH API ====================

export const authAPI = {
  async signup(username: string, email: string, password: string): Promise<AuthResponse> {
    await delay(500);

    if (!username || !email || !password) {
      throw new Error('All fields are required.');
    }

    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

    // Check for duplicate username
    if (users.some((u: { username: string }) => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Username already taken. Please choose a different one.');
    }

    // Check for duplicate email
    if (users.some((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered. Please login or use a different email.');
    }

    const newUser = {
      id: uuidv4(),
      username,
      email: email.toLowerCase(),
      password: hashPassword(password),
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const token = btoa(JSON.stringify({ id: newUser.id, exp: Date.now() + 86400000 }));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    }));

    return {
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  },

  async login(usernameOrEmail: string, password: string): Promise<AuthResponse> {
    await delay(500);

    if (!usernameOrEmail || !password) {
      throw new Error('Username and password are required.');
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

    const user = users.find((u: { username: string; email: string }) => 
      u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
      u.email.toLowerCase() === usernameOrEmail.toLowerCase()
    );

    if (!user) {
      throw new Error('Invalid username or password.');
    }

    if (!verifyPassword(password, user.password)) {
      throw new Error('Invalid username or password.');
    }

    const token = btoa(JSON.stringify({ id: user.id, exp: Date.now() + 86400000 }));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }));

    return {
      message: 'Login successful!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },

  async verifyToken(): Promise<User | null> {
    await delay(200);

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    if (!token || !userStr) {
      return null;
    }

    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        this.logout();
        return null;
      }
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
};

// ==================== PRODUCTS API ====================

export const productsAPI = {
  async getAll(): Promise<Product[]> {
    await delay(300);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },

  async getById(id: string): Promise<Product | null> {
    await delay(200);
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    return products.find((p: Product) => p.id === id) || null;
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    await delay(300);
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const newProduct = { ...product, id: uuidv4() };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    await delay(300);
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const index = products.findIndex((p: Product) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return products[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filtered = products.filter((p: Product) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  },
};

// ==================== CONTACT SETTINGS API ====================

export const settingsAPI = {
  async getContact(): Promise<ContactSettings> {
    await delay(200);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT) || JSON.stringify(defaultContactSettings));
  },

  async updateContact(settings: ContactSettings): Promise<ContactSettings> {
    await delay(300);
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(settings));
    return settings;
  },
};

// ==================== INQUIRIES API ====================

export const inquiriesAPI = {
  async getAll(): Promise<CustomerInquiry[]> {
    await delay(200);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
  },

  async create(inquiry: Omit<CustomerInquiry, 'id' | 'timestamp'>): Promise<CustomerInquiry> {
    await delay(200);
    const inquiries = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
    const newInquiry = {
      ...inquiry,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    // Keep only last 100
    if (inquiries.length > 100) {
      inquiries.pop();
    }
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    return newInquiry;
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const inquiries = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
    const filtered = inquiries.filter((i: CustomerInquiry) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(filtered));
  },

  async clearAll(): Promise<void> {
    await delay(200);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([]));
  },
};
