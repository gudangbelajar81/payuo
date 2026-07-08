import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwgnhsvvhdjwubuayhaq.supabase.co';
const supabaseAnonKey = 'sb_publishable_IzJRVji3DL5EgLODkEW7MA_OycitYwO';

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
