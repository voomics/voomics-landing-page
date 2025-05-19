
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
    // For testing purposes, let's add some mock data if the real data is empty
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
    
    // Check if data is empty, and if so, insert some test data
    if (!data || data.length === 0) {
      console.log("No waitlist data found, adding test data");
      
      // Create some test entries
      const testEntries = [
        {
          email: "test@example.com",
          role: "reader",
          mobile: "1234567890",
          notify_creator_tools: true,
          suggestions: "I'd love to see more manga content",
          story_idea: null,
          file_url: null
        },
        {
          email: "creator@example.com",
          role: "creator",
          mobile: "9876543210",
          notify_creator_tools: true,
          suggestions: null,
          story_idea: "A story about AI learning to create comics",
          file_url: null
        }
      ];
      
      // Insert test entries
      const { data: insertedData, error: insertError } = await supabase
        .from('waitlist')
        .insert(testEntries)
        .select();
        
      if (insertError) {
        console.error("Error adding test data:", insertError);
        return [];
      }
      
      // Validate and return the inserted data
      return validateWaitlistData(insertedData || []);
    }
    
    // Validate and transform the data for existing entries
    return validateWaitlistData(data);
  } catch (error) {
    console.error("Waitlist data fetch error:", error);
    toast.error("Data error", {
      description: "An unexpected error occurred while fetching data."
    });
    return [];
  }
};

// Helper function to validate waitlist data
function validateWaitlistData(data: any[]): WaitlistEntry[] {
  return data.map(item => {
    // Ensure role is either 'reader' or 'creator'
    const validatedRole = item.role === 'reader' || item.role === 'creator' 
      ? item.role as 'reader' | 'creator' 
      : 'reader'; // Default to 'reader' if invalid
    
    return {
      id: item.id,
      email: item.email,
      role: validatedRole,
      mobile: item.mobile,
      notify_creator_tools: Boolean(item.notify_creator_tools),
      suggestions: item.suggestions,
      story_idea: item.story_idea,
      file_url: item.file_url,
      created_at: item.created_at
    } as WaitlistEntry;
  });
}
