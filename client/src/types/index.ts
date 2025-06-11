export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  company_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  totalInvoices?: number;
  totalAmount?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  unit: string;
  company_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  logo_url?: string | null;
  website?: string | null;
  tax_id?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string | null;
  product_name: string;
  description: string | null;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  company_id: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  issue_date: string;
  due_date: string;
  notes?: string | null;
  template: 'modern' | 'classic' | 'minimal';
  user_id: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  company?: Company;
  items?: InvoiceItem[];
}

export type NavigationTab = 'dashboard' | 'invoices' | 'clients' | 'products' | 'company' | 'settings';

export interface User {
  id: string;
  email: string;
  created_at: string;
}