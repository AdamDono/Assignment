// Matches what the backend entities return

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  createdAt: string;
  total: number;
  items: OrderItem[];
}

export interface User {
  id: number;
  email: string;
  role: 'customer' | 'admin';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
