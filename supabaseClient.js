import { createClient } from "@supabase/supabase-js";

// These two values come from your Supabase project settings.
// They are set in a file called .env (see .env.example) so they
// are never typed directly into this code file.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
