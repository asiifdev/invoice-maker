// shared/schema.ts
import {
  pgTable,
  text,
  serial, // Mungkin tidak lagi diperlukan jika serial hanya untuk tabel users kustom
  integer,
  uuid, // Tetap diperlukan untuk user_id dan PK lainnya
  decimal,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Hapus seluruh definisi tabel users kustom ini ---
// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   email: text("email").notNull().unique(),
//   password: text("password").notNull(),
// });

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  website: text("website"),
  tax_id: text("tax_id"),
  logo_url: text("logo_url"),
  user_id: text("user_id").notNull(), // KOREKSI: Pastikan ini UUID karena merujuk ke auth.users(id)
  created_at: timestamp("created_at", { mode: 'string', withTimezone: true }).defaultNow(), // KOREKSI: Sesuaikan dengan timestamptz
  updated_at: timestamp("updated_at", { mode: 'string', withTimezone: true }).defaultNow(), // KOREKSI: Sesuaikan dengan timestamptz
});

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  company_id: uuid("company_id").notNull().references(() => companies.id),
  user_id: text("user_id").notNull(), // KOREKSI: Pastikan ini UUID
  created_at: timestamp("created_at", { mode: 'string', withTimezone: true }).defaultNow(), // KOREKSI: Sesuaikan dengan timestamptz
  updated_at: timestamp("updated_at", { mode: 'string', withTimezone: true }).defaultNow(), // KOREKSI: Sesuaikan dengan timestamptz
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  category: text("category").notNull(),
  unit: text("unit").notNull().default("pcs"),
  company_id: uuid("company_id").notNull().references(() => companies.id),
  user_id: text("user_id").notNull(), // KOREKSI: Pastikan ini UUID
  created_at: timestamp("created_at", { mode: 'string', withTimezone: true }).defaultNow(), // KOREKSI: Sesuaikan dengan timestamptz
  updated_at: timestamp("updated_at", { mode: 'string', withTimezone: true }).defaultNow(), // KOREKSI: Sesuaikan dengan timestamptz
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoice_number: text("invoice_number").notNull(),
  client_id: uuid("client_id").notNull().references(() => clients.id),
  company_id: uuid("company_id").notNull().references(() => companies.id),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull().default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("pending"),
  issue_date: date("issue_date", { mode: 'string' }).notNull().defaultNow(), // KOREKSI: Tambahkan mode
  due_date: date("due_date", { mode: 'string' }).notNull(), // KOREKSI: Tambahkan mode
  notes: text("notes"),
  template: text("template").notNull().default("modern"),
  user_id: text("user_id").notNull(), // KOREKSI: Pastikan ini UUID
  created_at: timestamp("created_at", { mode: 'string', withTimezone: true }).defaultNow(), // KOREKSI: Sesuaikan dengan timestamptz
  updated_at: timestamp("updated_at", { mode: 'string', withTimezone: true }).defaultNow(), // KOREKSI: Sesuaikan dengan timestamptz
});

export const invoice_items = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoice_id: uuid("invoice_id").notNull(),
  product_id: uuid("product_id"),
  product_name: text("product_name").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull().default("0"),
  created_at: timestamp("created_at", { mode: 'string', withTimezone: true }).defaultNow(), // KOREKSI: Sesuaikan dengan timestamptz
});

// === Tambahkan tabel invoice_settings di sini ===
export const invoice_settings = pgTable("invoice_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoice_pattern: text("invoice_pattern")
    .notNull()
    .default("INV{YY}{MM}{DD}-{###}"),
  next_number: integer("next_number").notNull().default(1),
  user_id: text("user_id").notNull(), // Ini harus UUID karena merujuk ke auth.users(id)
  created_at: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
});

// --- Hapus insertUserSchema karena tabel users kustom dihapus ---
// export const insertUserSchema = createInsertSchema(users).pick({
//   email: true,
//   password: true,
// });

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertInvoiceItemSchema = createInsertSchema(invoice_items).omit({
  id: true,
  created_at: true,
});

export const insertInvoiceSettingSchema = createInsertSchema(
  invoice_settings
).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Types
// --- Hapus InsertUser dan User karena tabel users kustom dihapus ---
// export type InsertUser = z.infer<typeof insertUserSchema>;
// export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;
export type InvoiceItem = typeof invoice_items.$inferSelect;

export type InsertInvoiceSetting = z.infer<typeof insertInvoiceSettingSchema>;
export type InvoiceSettings = typeof invoice_settings.$inferSelect;