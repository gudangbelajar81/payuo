import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client safely
let supabaseInstance = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    // Basic validation to ensure URL starts with http
    if (!supabaseUrl.startsWith('http')) {
      console.error('Invalid Supabase URL: Must start with http:// or https://');
    } else {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export const supabase = supabaseInstance;
