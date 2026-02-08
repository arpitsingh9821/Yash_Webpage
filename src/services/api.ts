const API_BASE = '/api';

// Initialize database on first load
export const initDatabase = async () => {
  try {
    await fetch(`${API_BASE}/init/seed`, { method: 'GET' });
  } catch (error) {
    console.log('Database initialization:', error);
  }
};

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

// API helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  signup: async (username: string, email: string, password: string) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    setToken(data.token);
    return data;
  },

  login: async (username: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(data.token);
    return data;
  },

  me: async () => {
    return await apiRequest('/auth/me', { method: 'GET' });
  },

  logout: () => {
    removeToken();
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    return await apiRequest('/products', { method: 'GET' });
  },

  create: async (product: {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  }) => {
    return await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: async (
    id: string,
    product: {
      name?: string;
      description?: string;
      price?: number;
      image?: string;
      category?: string;
    }
  ) => {
    return await apiRequest('/products', {
      method: 'PUT',
      body: JSON.stringify({ id, ...product }),
    });
  },

  delete: async (id: string) => {
    return await apiRequest('/products', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },
};

// Contacts API
export const contactsAPI = {
  get: async () => {
    return await apiRequest('/contacts', { method: 'GET' });
  },

  update: async (contacts: {
    whatsapp?: string;
    instagram?: string;
    telegram?: string;
  }) => {
    return await apiRequest('/contacts', {
      method: 'PUT',
      body: JSON.stringify(contacts),
    });
  },
};

// Inquiries API
export const inquiriesAPI = {
  getAll: async () => {
    return await apiRequest('/inquiries', { method: 'GET' });
  },

  create: async (inquiry: {
    productName: string;
    customerName?: string;
    platform: string;
  }) => {
    return await apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    });
  },

  delete: async (id: string) => {
    return await apiRequest('/inquiries', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },
};
