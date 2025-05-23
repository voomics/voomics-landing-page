
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wslvwkwylanhdsdekwmf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzbHZ3a3d5bGFuaGRzZGVrd21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1Nzk4MTEsImV4cCI6MjA2MzE1NTgxMX0.8bPA3XBt2LkNog0Fu7y-w8xcF1YDbYy8UoAlUADgh7Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Add the storage URL for accessing files
export const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public`;
