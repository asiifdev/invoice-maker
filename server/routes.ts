import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCompanySchema,
  insertClientSchema,
  insertProductSchema,
  insertInvoiceSchema,
  insertInvoiceItemSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple auth middleware - in a real app you'd use proper session management
  const requireAuth = (req: any, res: any, next: any) => {
    // For demo purposes, we'll use a hardcoded user ID
    // In a real app, this would come from session/JWT
    req.userId = "demo-user-123";
    next();
  };

  // Company routes
  app.get("/api/companies", requireAuth, async (req: any, res) => {
    try {
      const companies = await storage.getCompanies(req.userId);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.post("/api/companies", requireAuth, async (req: any, res) => {
    try {
      const companyData = insertCompanySchema.parse({
        ...req.body,
        user_id: req.userId,
      });
      
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  app.put("/api/companies/:id", requireAuth, async (req: any, res) => {
    try {
      const companyData = insertCompanySchema.partial().parse(req.body);
      const company = await storage.updateCompany(req.params.id, companyData, req.userId);
      
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  // Client routes
  app.get("/api/clients", requireAuth, async (req: any, res) => {
    try {
      const clients = await storage.getClients(req.userId);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", requireAuth, async (req: any, res) => {
    try {
      const clientData = insertClientSchema.parse({
        ...req.body,
        user_id: req.userId,
      });
      
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: "Invalid client data" });
    }
  });

  app.put("/api/clients/:id", requireAuth, async (req: any, res) => {
    try {
      const clientData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, clientData, req.userId);
      
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: "Invalid client data" });
    }
  });

  // Product routes
  app.get("/api/products", requireAuth, async (req: any, res) => {
    try {
      const products = await storage.getProducts(req.userId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", requireAuth, async (req: any, res) => {
    try {
      const productData = insertProductSchema.parse({
        ...req.body,
        user_id: req.userId,
      });
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", requireAuth, async (req: any, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData, req.userId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  // Invoice routes
  app.get("/api/invoices", requireAuth, async (req: any, res) => {
    try {
      const invoices = await storage.getInvoices(req.userId);
      // Get related data for each invoice
      const invoicesWithDetails = await Promise.all(
        invoices.map(async (invoice) => {
          const [client, company, items] = await Promise.all([
            storage.getClient(invoice.client_id, req.userId),
            storage.getCompany(invoice.company_id, req.userId),
            storage.getInvoiceItems(invoice.id),
          ]);
          
          return {
            ...invoice,
            client,
            company,
            items,
          };
        })
      );
      
      res.json(invoicesWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", requireAuth, async (req: any, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id, req.userId);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }

      const [client, company, items] = await Promise.all([
        storage.getClient(invoice.client_id, req.userId),
        storage.getCompany(invoice.company_id, req.userId),
        storage.getInvoiceItems(invoice.id),
      ]);

      res.json({
        ...invoice,
        client,
        company,
        items,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", requireAuth, async (req: any, res) => {
    try {
      const { items, ...invoiceData } = req.body;
      
      const invoiceToCreate = insertInvoiceSchema.parse({
        ...invoiceData,
        user_id: req.userId,
      });
      
      const invoice = await storage.createInvoice(invoiceToCreate);
      
      // Create invoice items if provided
      if (items && Array.isArray(items)) {
        const createdItems = await Promise.all(
          items.map((item: any) => {
            const itemData = insertInvoiceItemSchema.parse({
              ...item,
              invoice_id: invoice.id,
            });
            return storage.createInvoiceItem(itemData);
          })
        );
        
        res.status(201).json({
          ...invoice,
          items: createdItems,
        });
      } else {
        res.status(201).json(invoice);
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid invoice data" });
    }
  });

  app.put("/api/invoices/:id", requireAuth, async (req: any, res) => {
    try {
      const invoiceData = insertInvoiceSchema.partial().parse(req.body);
      const invoice = await storage.updateInvoice(req.params.id, invoiceData, req.userId);
      
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      
      res.json(invoice);
    } catch (error) {
      res.status(400).json({ error: "Invalid invoice data" });
    }
  });

  // Invoice item routes
  app.get("/api/invoices/:invoiceId/items", requireAuth, async (req: any, res) => {
    try {
      // Verify invoice belongs to user
      const invoice = await storage.getInvoice(req.params.invoiceId, req.userId);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      
      const items = await storage.getInvoiceItems(req.params.invoiceId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice items" });
    }
  });

  app.post("/api/invoices/:invoiceId/items", requireAuth, async (req: any, res) => {
    try {
      // Verify invoice belongs to user
      const invoice = await storage.getInvoice(req.params.invoiceId, req.userId);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      
      const itemData = insertInvoiceItemSchema.parse({
        ...req.body,
        invoice_id: req.params.invoiceId,
      });
      
      const item = await storage.createInvoiceItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid invoice item data" });
    }
  });

  app.put("/api/invoice-items/:id", requireAuth, async (req: any, res) => {
    try {
      const itemData = insertInvoiceItemSchema.partial().parse(req.body);
      const item = await storage.updateInvoiceItem(req.params.id, itemData);
      
      if (!item) {
        return res.status(404).json({ error: "Invoice item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid invoice item data" });
    }
  });

  app.delete("/api/invoice-items/:id", requireAuth, async (req: any, res) => {
    try {
      await storage.deleteInvoiceItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete invoice item" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", requireAuth, async (req: any, res) => {
    try {
      const [companies, clients, products, invoices] = await Promise.all([
        storage.getCompanies(req.userId),
        storage.getClients(req.userId),
        storage.getProducts(req.userId),
        storage.getInvoices(req.userId),
      ]);

      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + parseFloat(inv.total), 0);

      const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
      const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;

      res.json({
        totalCompanies: companies.length,
        totalClients: clients.length,
        totalProducts: products.length,
        totalInvoices: invoices.length,
        totalRevenue,
        pendingInvoices,
        overdueInvoices,
        paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
