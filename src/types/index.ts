export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

export interface ContactSettings {
  whatsapp: string;
  instagram: string;
  telegram: string;
}

export interface CustomerInquiry {
  id: string;
  productId: string;
  productName: string;
  platform: 'whatsapp' | 'instagram' | 'telegram';
  timestamp: string;
}

export interface AppData {
  products: Product[];
  contactSettings: ContactSettings;
  inquiries: CustomerInquiry[];
}
