export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          country: string;
          website: string | null;
          tax_id: string | null;
          logo_url: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          country: string;
          website?: string | null;
          tax_id?: string | null;
          logo_url?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          country?: string;
          website?: string | null;
          tax_id?: string | null;
          logo_url?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          country: string;
          company_id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          country?: string;
          company_id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          category: string;
          unit?: string;
          company_id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          category?: string;
          unit?: string;
          company_id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
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
          notes: string | null;
          template: 'modern' | 'classic' | 'minimal';
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_number: string;
          client_id: string;
          company_id: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          status?: 'paid' | 'pending' | 'overdue';
          issue_date?: string;
          due_date: string;
          notes?: string | null;
          template?: 'modern' | 'classic' | 'minimal';
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_number?: string;
          client_id?: string;
          company_id?: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          status?: 'paid' | 'pending' | 'overdue';
          issue_date?: string;
          due_date?: string;
          notes?: string | null;
          template?: 'modern' | 'classic' | 'minimal';
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          product_id: string | null;
          product_name: string;
          description: string | null;
          quantity: number;
          price: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          product_id?: string | null;
          product_name: string;
          description?: string | null;
          quantity?: number;
          price?: number;
          total?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          product_id?: string | null;
          product_name?: string;
          description?: string | null;
          quantity?: number;
          price?: number;
          total?: number;
          created_at?: string;
        };
      };
    };
  };
}