import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { productsAPI, contactsAPI, inquiriesAPI } from '../services/api';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface ContactSettings {
  whatsapp: string;
  instagram: string;
  telegram: string;
}

export interface Inquiry {
  id: string;
  productName: string;
  customerName: string;
  platform: 'whatsapp' | 'instagram' | 'telegram';
  timestamp: Date;
}

interface AppContextType {
  products: Product[];
  contactSettings: ContactSettings;
  inquiries: Inquiry[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateContactSettings: (settings: Partial<ContactSettings>) => Promise<void>;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'timestamp'>) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    whatsapp: '919876543210',
    instagram: 'always.demon',
    telegram: 'alwaysdemon'
  });
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Fetch products
      const productsResponse = await productsAPI.getAll();
      setProducts(productsResponse.products);

      // Fetch contacts
      const contactsResponse = await contactsAPI.get();
      setContactSettings(contactsResponse.contacts);

      // Fetch inquiries if admin
      if (user?.isAdmin) {
        try {
          const inquiriesResponse = await inquiriesAPI.getAll();
          setInquiries(inquiriesResponse.inquiries);
        } catch {
          // Not admin or error fetching inquiries
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, user?.isAdmin]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await productsAPI.create({
        ...product,
        price: Number(product.price)
      });
      setProducts(prev => [...prev, response.product]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      await productsAPI.update(id, {
        ...product,
        price: product.price ? Number(product.price) : undefined
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const updateContactSettings = async (settings: Partial<ContactSettings>) => {
    try {
      await contactsAPI.update(settings);
      setContactSettings(prev => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Error updating contacts:', error);
      throw error;
    }
  };

  const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'timestamp'>) => {
    try {
      await inquiriesAPI.create(inquiry);
    } catch (error) {
      console.error('Error adding inquiry:', error);
      // Don't throw - inquiry tracking is not critical
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      await inquiriesAPI.delete(id);
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      products,
      contactSettings,
      inquiries,
      isLoading,
      addProduct,
      updateProduct,
      deleteProduct,
      updateContactSettings,
      addInquiry,
      deleteInquiry,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
