
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  email: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          // If we have a session, get the admin user from localStorage
          const storedUser = localStorage.getItem('admin_user');
          if (storedUser) {
            setAdminUser(JSON.parse(storedUser));
          } else {
            // If no stored user but we have a session, clear the session
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // First sign in with Supabase auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        console.error("Supabase auth error:", authError);
        toast.error("Login failed", {
          description: "Invalid email or password."
        });
        return false;
      }
      
      // Then authenticate against admin DB function
      const { data, error } = await supabase.rpc('authenticate_admin', {
        email_input: email,
        password_input: password
      });
      
      if (error || !data || data.length === 0) {
        // If admin authentication fails, sign out from Supabase auth
        await supabase.auth.signOut();
        
        console.error("Admin login failed:", error);
        toast.error("Login failed", {
          description: "Invalid admin credentials."
        });
        return false;
      }
      
      const adminUserData = data[0] as AdminUser;
      localStorage.setItem('admin_user', JSON.stringify(adminUserData));
      setAdminUser(adminUserData);
      
      toast.success("Login successful", {
        description: "Welcome to the admin dashboard."
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login error", {
        description: "An unexpected error occurred."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      localStorage.removeItem('admin_user');
      await supabase.auth.signOut();
      setAdminUser(null);
      
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout error", {
        description: "An unexpected error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
