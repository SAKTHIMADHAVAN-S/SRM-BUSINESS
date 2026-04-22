import { User, Order, Review, CartItem, Category, Product } from '../types';

const API_BASE = '/api';

export const api = {
  async signup(data: any): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.error) throw new Error(result.error);
    return result;
  },

  async login(data: any): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.error) throw new Error(result.error);
    return result;
  },

  async logout() {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const result = await res.json();
    if (result.error) throw new Error(result.error);
    return result;
  },

  async getMe(): Promise<User | null> {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) return null;
    return res.json();
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) return [];
    return res.json();
  },

  // Admin Actions
  async adminAddCategory(data: any): Promise<Category> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async adminDeleteCategory(id: string): Promise<void> {
    await fetch(`${API_BASE}/admin/categories/${id}`, { method: 'DELETE' });
  },

  async adminAddProduct(data: any): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async adminUpdateProduct(id: string, data: any): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async adminDeleteProduct(id: string): Promise<void> {
    await fetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' });
  },

  async adminUpdateOrderStatus(id: string, status: string, message: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, message }),
    });
    return res.json();
  },

  async createOrder(data: { items: CartItem[], totalAmount: number }): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async trackOrder(orderId: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/track/${orderId}`);
    const result = await res.json();
    if (result.error) throw new Error(result.error);
    return result;
  },

  async getReviews(productId: string): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews/${productId}`);
    return res.json();
  },

  async postReview(data: { productId: string, rating: number, comment: string }): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  
  async subscribeNewsletter(email: string): Promise<{ success: boolean, message: string }> {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async adminSendMarketingBlast(data: { subject: string, message: string }): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/marketing/blast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
