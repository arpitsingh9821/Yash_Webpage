import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ContactSettings, CustomerInquiry } from '../types';

interface AppContextType {
  products: Product[];
  contactSettings: ContactSettings;
  inquiries: CustomerInquiry[];
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateContactSettings: (settings: ContactSettings) => void;
  addInquiry: (inquiry: Omit<CustomerInquiry, 'id' | 'timestamp'>) => void;
}

const defaultContactSettings: ContactSettings = {
  whatsapp: '+1234567890',
  instagram: 'always_demon',
  telegram: 'always_demon',
};

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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('demon_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [contactSettings, setContactSettings] = useState<ContactSettings>(() => {
    const saved = localStorage.getItem('demon_contact');
    return saved ? JSON.parse(saved) : defaultContactSettings;
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('demon_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('demon_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('demon_contact', JSON.stringify(contactSettings));
  }, [contactSettings]);

  useEffect(() => {
    localStorage.setItem('demon_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateContactSettings = (settings: ContactSettings) => {
    setContactSettings(settings);
  };

  const addInquiry = (inquiry: Omit<CustomerInquiry, 'id' | 'timestamp'>) => {
    const newInquiry: CustomerInquiry = {
      ...inquiry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        contactSettings,
        inquiries,
        isAdmin,
        setIsAdmin,
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
