export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'customer';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  full_name: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  stock_quantity: number;
  sku?: string;
  image_url?: string;
  images?: string;
  is_active: boolean;
  is_featured: boolean;
  category_id?: number;
  category?: Category;
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  notes?: string;
  order_items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface CreateOrderData {
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  notes?: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  total_customers: number;
  pending_orders: number;
  low_stock_products: number;
}
