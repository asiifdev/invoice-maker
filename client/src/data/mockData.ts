import { Client, Product, Company, Invoice } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave',
    city: 'New York',
    country: 'USA',
    createdAt: '2024-01-15',
    totalInvoices: 12,
    totalAmount: 45000
  },
  {
    id: '2',
    name: 'Tech Solutions Inc',
    email: 'hello@techsolutions.com',
    phone: '+1 (555) 987-6543',
    address: '456 Innovation Blvd',
    city: 'San Francisco',
    country: 'USA',
    createdAt: '2024-02-01',
    totalInvoices: 8,
    totalAmount: 32000
  },
  {
    id: '3',
    name: 'Digital Marketing Pro',
    email: 'info@digitalmarketing.com',
    phone: '+1 (555) 456-7890',
    address: '789 Creative St',
    city: 'Los Angeles',
    country: 'USA',
    createdAt: '2024-02-15',
    totalInvoices: 15,
    totalAmount: 67500
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Custom website development service',
    price: 5000,
    category: 'Development',
    unit: 'project'
  },
  {
    id: '2',
    name: 'UI/UX Design',
    description: 'User interface and experience design',
    price: 150,
    category: 'Design',
    unit: 'hour'
  },
  {
    id: '3',
    name: 'SEO Optimization',
    description: 'Search engine optimization service',
    price: 800,
    category: 'Marketing',
    unit: 'month'
  },
  {
    id: '4',
    name: 'Consulting',
    description: 'Business strategy consulting',
    price: 200,
    category: 'Consulting',
    unit: 'hour'
  }
];

export const mockCompany: Company = {
  id: '1',
  name: 'Your Company Name',
  email: 'hello@yourcompany.com',
  phone: '+1 (555) 000-0000',
  address: '123 Main Street',
  city: 'Your City',
  country: 'Your Country',
  website: 'www.yourcompany.com',
  taxId: 'TAX123456789'
};

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientId: '1',
    clientName: 'Acme Corporation',
    companyId: '1',
    items: [
      {
        productId: '1',
        productName: 'Web Development',
        description: 'E-commerce website development',
        quantity: 1,
        price: 5000,
        total: 5000
      },
      {
        productId: '2',
        productName: 'UI/UX Design',
        description: 'Mobile app design',
        quantity: 40,
        price: 150,
        total: 6000
      }
    ],
    subtotal: 11000,
    tax: 990,
    total: 11990,
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    template: 'modern'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientId: '2',
    clientName: 'Tech Solutions Inc',
    companyId: '1',
    items: [
      {
        productId: '3',
        productName: 'SEO Optimization',
        description: 'Monthly SEO service',
        quantity: 3,
        price: 800,
        total: 2400
      }
    ],
    subtotal: 2400,
    tax: 216,
    total: 2616,
    status: 'pending',
    issueDate: '2024-02-01',
    dueDate: '2024-03-01',
    template: 'classic'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientId: '3',
    clientName: 'Digital Marketing Pro',
    companyId: '1',
    items: [
      {
        productId: '4',
        productName: 'Consulting',
        description: 'Strategy consultation',
        quantity: 20,
        price: 200,
        total: 4000
      }
    ],
    subtotal: 4000,
    tax: 360,
    total: 4360,
    status: 'overdue',
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
    template: 'minimal'
  }
];