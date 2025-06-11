import { 
  users, 
  companies,
  clients,
  products,
  invoices,
  invoice_items,
  type User, 
  type InsertUser,
  type Company,
  type InsertCompany,
  type Client,
  type InsertClient,
  type Product,
  type InsertProduct,
  type Invoice,
  type InsertInvoice,
  type InvoiceItem,
  type InsertInvoiceItem
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Company methods
  getCompanies(userId: string): Promise<Company[]>;
  getCompany(id: string, userId: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<InsertCompany>, userId: string): Promise<Company | undefined>;

  // Client methods
  getClients(userId: string): Promise<Client[]>;
  getClient(id: string, userId: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>, userId: string): Promise<Client | undefined>;

  // Product methods
  getProducts(userId: string): Promise<Product[]>;
  getProduct(id: string, userId: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>, userId: string): Promise<Product | undefined>;

  // Invoice methods
  getInvoices(userId: string): Promise<Invoice[]>;
  getInvoice(id: string, userId: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>, userId: string): Promise<Invoice | undefined>;

  // Invoice Item methods
  getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]>;
  createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem>;
  updateInvoiceItem(id: string, item: Partial<InsertInvoiceItem>): Promise<InvoiceItem | undefined>;
  deleteInvoiceItem(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Company methods
  async getCompanies(userId: string): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.user_id, userId));
  }

  async getCompany(id: string, userId: string): Promise<Company | undefined> {
    const result = await db.select().from(companies)
      .where(and(eq(companies.id, id), eq(companies.user_id, userId)));
    return result[0];
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const result = await db.insert(companies).values(company).returning();
    return result[0];
  }

  async updateCompany(id: string, company: Partial<InsertCompany>, userId: string): Promise<Company | undefined> {
    const result = await db.update(companies)
      .set({ ...company, updated_at: new Date() })
      .where(and(eq(companies.id, id), eq(companies.user_id, userId)))
      .returning();
    return result[0];
  }

  // Client methods
  async getClients(userId: string): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.user_id, userId));
  }

  async getClient(id: string, userId: string): Promise<Client | undefined> {
    const result = await db.select().from(clients)
      .where(and(eq(clients.id, id), eq(clients.user_id, userId)));
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async updateClient(id: string, client: Partial<InsertClient>, userId: string): Promise<Client | undefined> {
    const result = await db.update(clients)
      .set({ ...client, updated_at: new Date() })
      .where(and(eq(clients.id, id), eq(clients.user_id, userId)))
      .returning();
    return result[0];
  }

  // Product methods
  async getProducts(userId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.user_id, userId));
  }

  async getProduct(id: string, userId: string): Promise<Product | undefined> {
    const result = await db.select().from(products)
      .where(and(eq(products.id, id), eq(products.user_id, userId)));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>, userId: string): Promise<Product | undefined> {
    const result = await db.update(products)
      .set({ ...product, updated_at: new Date() })
      .where(and(eq(products.id, id), eq(products.user_id, userId)))
      .returning();
    return result[0];
  }

  // Invoice methods
  async getInvoices(userId: string): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.user_id, userId));
  }

  async getInvoice(id: string, userId: string): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.user_id, userId)));
    return result[0];
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values(invoice).returning();
    return result[0];
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>, userId: string): Promise<Invoice | undefined> {
    const result = await db.update(invoices)
      .set({ ...invoice, updated_at: new Date() })
      .where(and(eq(invoices.id, id), eq(invoices.user_id, userId)))
      .returning();
    return result[0];
  }

  // Invoice Item methods
  async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    return await db.select().from(invoice_items).where(eq(invoice_items.invoice_id, invoiceId));
  }

  async createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem> {
    const result = await db.insert(invoice_items).values(item).returning();
    return result[0];
  }

  async updateInvoiceItem(id: string, item: Partial<InsertInvoiceItem>): Promise<InvoiceItem | undefined> {
    const result = await db.update(invoice_items)
      .set(item)
      .where(eq(invoice_items.id, id))
      .returning();
    return result[0];
  }

  async deleteInvoiceItem(id: string): Promise<void> {
    await db.delete(invoice_items).where(eq(invoice_items.id, id));
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<string, Company>;
  private clients: Map<string, Client>;
  private products: Map<string, Product>;
  private invoices: Map<string, Invoice>;
  private invoiceItems: Map<string, InvoiceItem>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.clients = new Map();
    this.products = new Map();
    this.invoices = new Map();
    this.invoiceItems = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Company methods
  async getCompanies(userId: string): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(c => c.user_id === userId);
  }

  async getCompany(id: string, userId: string): Promise<Company | undefined> {
    const company = this.companies.get(id);
    return company?.user_id === userId ? company : undefined;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const id = crypto.randomUUID();
    const newCompany: Company = {
      ...company,
      id,
      website: company.website ?? null,
      tax_id: company.tax_id ?? null,
      logo_url: company.logo_url ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  async updateCompany(id: string, company: Partial<InsertCompany>, userId: string): Promise<Company | undefined> {
    const existing = this.companies.get(id);
    if (!existing || existing.user_id !== userId) return undefined;
    
    const updated: Company = {
      ...existing,
      ...company,
      updated_at: new Date(),
    };
    this.companies.set(id, updated);
    return updated;
  }

  // Client methods
  async getClients(userId: string): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(c => c.user_id === userId);
  }

  async getClient(id: string, userId: string): Promise<Client | undefined> {
    const client = this.clients.get(id);
    return client?.user_id === userId ? client : undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = crypto.randomUUID();
    const newClient: Client = {
      ...client,
      id,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.clients.set(id, newClient);
    return newClient;
  }

  async updateClient(id: string, client: Partial<InsertClient>, userId: string): Promise<Client | undefined> {
    const existing = this.clients.get(id);
    if (!existing || existing.user_id !== userId) return undefined;
    
    const updated: Client = {
      ...existing,
      ...client,
      updated_at: new Date(),
    };
    this.clients.set(id, updated);
    return updated;
  }

  // Product methods
  async getProducts(userId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.user_id === userId);
  }

  async getProduct(id: string, userId: string): Promise<Product | undefined> {
    const product = this.products.get(id);
    return product?.user_id === userId ? product : undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = crypto.randomUUID();
    const newProduct: Product = {
      ...product,
      id,
      description: product.description ?? null,
      price: product.price ?? "0",
      unit: product.unit ?? "pcs",
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>, userId: string): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing || existing.user_id !== userId) return undefined;
    
    const updated: Product = {
      ...existing,
      ...product,
      updated_at: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  // Invoice methods
  async getInvoices(userId: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(i => i.user_id === userId);
  }

  async getInvoice(id: string, userId: string): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    return invoice?.user_id === userId ? invoice : undefined;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = crypto.randomUUID();
    const newInvoice: Invoice = {
      ...invoice,
      id,
      status: invoice.status ?? "pending",
      subtotal: invoice.subtotal ?? "0",
      tax: invoice.tax ?? "0",
      total: invoice.total ?? "0",
      issue_date: invoice.issue_date ?? new Date().toISOString().split('T')[0],
      notes: invoice.notes ?? null,
      template: invoice.template ?? "modern",
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>, userId: string): Promise<Invoice | undefined> {
    const existing = this.invoices.get(id);
    if (!existing || existing.user_id !== userId) return undefined;
    
    const updated: Invoice = {
      ...existing,
      ...invoice,
      updated_at: new Date(),
    };
    this.invoices.set(id, updated);
    return updated;
  }

  // Invoice Item methods
  async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    return Array.from(this.invoiceItems.values()).filter(item => item.invoice_id === invoiceId);
  }

  async createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem> {
    const id = crypto.randomUUID();
    const newItem: InvoiceItem = {
      ...item,
      id,
      product_id: item.product_id ?? null,
      description: item.description ?? null,
      quantity: item.quantity ?? 1,
      price: item.price ?? "0",
      total: item.total ?? "0",
      created_at: new Date(),
    };
    this.invoiceItems.set(id, newItem);
    return newItem;
  }

  async updateInvoiceItem(id: string, item: Partial<InsertInvoiceItem>): Promise<InvoiceItem | undefined> {
    const existing = this.invoiceItems.get(id);
    if (!existing) return undefined;
    
    const updated: InvoiceItem = {
      ...existing,
      ...item,
    };
    this.invoiceItems.set(id, updated);
    return updated;
  }

  async deleteInvoiceItem(id: string): Promise<void> {
    this.invoiceItems.delete(id);
  }
}

export const storage = new MemStorage();
