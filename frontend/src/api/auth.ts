import type { User, AuthResponse } from '../types';
import { getAuthHeaders } from './client';

const BASE_URL = 'http://localhost:3000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
}

export async function apiRegister(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function apiCreateProduct(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
}): Promise<any> {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiUpdateProduct(
  id: number,
  data: Partial<{ name: string; description: string; price: number; stock: number }>,
): Promise<any> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiDeleteProduct(id: number): Promise<any> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  return handleResponse(res);
}
