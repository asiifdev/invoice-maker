import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jtplqfgagezjkijtucer.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cGxxZmdhZ2V6amtpanR1Y2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDAwMTMsImV4cCI6MjA2NTIxNjAxM30.rrSd07bIO9sd9q8AxicAffTNaAs9DKRaeAy9VeAlaG0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);