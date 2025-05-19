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
  const storedUser = localStorage.getItem('admin_user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const adminLogout = async (): Promise<void> => {
  try {
    localStorage.removeItem('admin_user');
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
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching waitlist data:", error);
      toast.error("Data fetch failed", {
        description: "Could not retrieve waitlist data."
      });
      return [];
    }
    
    // Validate and transform the data to ensure role is either 'reader' or 'creator'
    const validatedData: WaitlistEntry[] = data.map(item => {
      // Ensure role is either 'reader' or 'creator'
      const validatedRole = item.role === 'reader' || item.role === 'creator' 
        ? item.role as 'reader' | 'creator' 
        : 'reader'; // Default to 'reader' if invalid
      
      return {
        ...item,
        role: validatedRole
      } as WaitlistEntry;
    });
    
    return validatedData;
  } catch (error) {
    console.error("Waitlist data fetch error:", error);
    toast.error("Data error", {
      description: "An unexpected error occurred while fetching data."
    });
    return [];
  }
};
