const API_BASE = '/api';

// Token management
export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeToken(): void {
  localStorage.removeItem('token');
}

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: (username: string, email: string, password: string) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  login: (username: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  me: () => apiCall('/auth/me'),
  
  logout: () => {
    removeToken();
    return Promise.resolve();
  },
};

// Products API
export const productsAPI = {
  getAll: () => apiCall('/products'),

  create: (product: { name: string; description: string; price: number; image: string; category: string }) =>
    apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  update: (id: string, product: { name?: string; description?: string; price?: number; image?: string; category?: string }) =>
    apiCall('/products', {
      method: 'PUT',
      body: JSON.stringify({ id, ...product }),
    }),

  delete: (id: string) =>
    apiCall('/products', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }),
};

// Contacts API
export const contactsAPI = {
  get: () => apiCall('/contacts'),

  update: (contacts: { whatsapp: string; instagram: string; telegram: string }) =>
    apiCall('/contacts', {
      method: 'PUT',
      body: JSON.stringify(contacts),
    }),
};

// Inquiries API
export const inquiriesAPI = {
  getAll: () => apiCall('/inquiries'),

  create: (inquiry: { productName: string; platform: string }) =>
    apiCall('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    }),

  delete: (id: string) =>
    apiCall('/inquiries', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }),
};

// Initialize database
export async function initDatabase() {
  try {
    await apiCall('/seed');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}
