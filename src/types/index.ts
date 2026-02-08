// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

// Contact types
export interface ContactSettings {
  whatsapp: string;
  instagram: string;
  telegram: string;
}

// Inquiry types
export interface CustomerInquiry {
  id: string;
  productId: string;
  productName: string;
  platform: 'whatsapp' | 'instagram' | 'telegram';
  customerName?: string;
  timestamp: string;
}

// App state types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  products: Product[];
  contactSettings: ContactSettings;
  inquiries: CustomerInquiry[];
}

// Auth context types
export type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User };
