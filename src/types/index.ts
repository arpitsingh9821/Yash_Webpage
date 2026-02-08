export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
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
