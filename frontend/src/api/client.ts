import type { Product, Order } from '../types';

const BASE_URL = 'http://localhost:3000';

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  return handleResponse<Product[]>(res);
}

export async function checkout(
  items: { productId: number; quantity: number }[]
): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ items }),
  });
  return handleResponse<Order>(res);
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${BASE_URL}/orders`, {
    headers: { ...getAuthHeaders() },
  });
  return handleResponse<Order[]>(res);
}
