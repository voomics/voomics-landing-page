// This file is now deprecated, use the AdminAuthContext and waitlistService instead.
// Keeping this file temporarily for reference but it should be removed once the migration is complete.

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  email: string;
}

export const adminLogin = async (
  email: string,
  password: string
): Promise<AdminUser | null> => {
  try {
    console.warn("WARNING: Using deprecated adminService. Please update to use the AdminAuthContext.");
    
    // First, sign in with Supabase to establish a session
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if (authError) {
      console.error("Supabase auth error:", authError);
    }
    
    // Use the database function to authenticate admin with password
    const { data, error } = await supabase
      .rpc('authenticate_admin', {
        email_input: email,
        password_input: password
      });

    if (error || !data || data.length === 0) {
      console.error("Admin login failed:", error);
      toast.error("Login failed", {
        description: "Invalid email or password."
      });
      return null;
    }

    const adminUser: AdminUser = data[0];
    
    // Set local storage to maintain admin state
    localStorage.setItem('admin_user', JSON.stringify(adminUser));
    
    console.log("Admin login successful");
    return adminUser;
  } catch (error) {
    console.error("Admin login error:", error);
    toast.error("Login error", {
      description: "An unexpected error occurred."
    });
    return null;
  }
};

export const getAdminUser = (): AdminUser | null => {
  console.warn("WARNING: Using deprecated adminService. Please update to use the AdminAuthContext.");
  const storedUser = localStorage.getItem('admin_user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const adminLogout = async (): Promise<void> => {
  console.warn("WARNING: Using deprecated adminService. Please update to use the AdminAuthContext.");
  try {
    localStorage.removeItem('admin_user');
    
    // Also sign out from Supabase
    await supabase.auth.signOut();
    console.log("Admin logged out");
  } catch (error) {
    console.error("Admin logout error:", error);
  }
};

export interface WaitlistEntry {
  id: string;
  email: string;
  role: 'reader' | 'creator';
  mobile: string | null;
  notify_creator_tools: boolean | null;
  suggestions: string | null;
  story_idea: string | null;
  file_url: string | null;
  created_at: string;
}

export const fetchWaitlistData = async (): Promise<WaitlistEntry[]> => {
  console.warn("WARNING: Using deprecated adminService. Please update to use the waitlistService.");
  return [];
};

// Deprecated - use validateWaitlistData from waitlistService instead
function validateWaitlistData(data: any[]): WaitlistEntry[] {
  // This is kept for reference but should not be used
  return [];
}
