-- supabase/migrations/[TIMESTAMP]_add_invoice_settings.sql

-- Tabel Invoice Settings
CREATE TABLE IF NOT EXISTS invoice_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_pattern text NOT NULL DEFAULT 'INV{YY}{MM}{DD}-{###}',
  next_number integer NOT NULL DEFAULT 1,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_invoice_settings_user_id ON invoice_settings(user_id);

-- Enable RLS
ALTER TABLE invoice_settings ENABLE ROW LEVEL SECURITY;

-- Policies untuk Invoice Settings
CREATE POLICY "Users can manage their own invoice settings"
  ON invoice_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);