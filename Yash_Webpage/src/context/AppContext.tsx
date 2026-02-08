import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, ContactSettings, CustomerInquiry } from '../types';
import { productsAPI, settingsAPI, inquiriesAPI } from '../services/api';

interface AppContextType {
  products: Product[];
  contactSettings: ContactSettings;
  inquiries: CustomerInquiry[];
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  refreshInquiries: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateContactSettings: (settings: ContactSettings) => Promise<void>;
  addInquiry: (inquiry: Omit<CustomerInquiry, 'id' | 'timestamp'>) => Promise<void>;
}

const defaultContactSettings: ContactSettings = {
  whatsapp: '+1234567890',
  instagram: 'always_demon',
  telegram: 'always_demon',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(defaultContactSettings);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }, []);

  const refreshInquiries = useCallback(async () => {
    try {
      const data = await inquiriesAPI.getAll();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, settingsData, inquiriesData] = await Promise.all([
          productsAPI.getAll(),
          settingsAPI.getContact(),
          inquiriesAPI.getAll(),
        ]);
        setProducts(productsData);
        setContactSettings(settingsData);
        setInquiries(inquiriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = await productsAPI.create(product);
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await productsAPI.update(id, updates);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
  };

  const deleteProduct = async (id: string) => {
    await productsAPI.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateContactSettings = async (settings: ContactSettings) => {
    const updated = await settingsAPI.updateContact(settings);
    setContactSettings(updated);
  };

  const addInquiry = async (inquiry: Omit<CustomerInquiry, 'id' | 'timestamp'>) => {
    const newInquiry = await inquiriesAPI.create(inquiry);
    setInquiries(prev => [newInquiry, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        contactSettings,
        inquiries,
        isLoading,
        refreshProducts,
        refreshInquiries,
        addProduct,
        updateProduct,
        deleteProduct,
        updateContactSettings,
        addInquiry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
