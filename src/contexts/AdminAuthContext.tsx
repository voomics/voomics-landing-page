
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  email: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
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
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
          setAdminUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
        localStorage.removeItem('admin_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simple username/password check
      if (username === "raja" && password === "raja") {
        const adminUserData: AdminUser = {
          id: "admin-raja",
          email: "raja@admin.com"
        };
        
        localStorage.setItem('admin_user', JSON.stringify(adminUserData));
        setAdminUser(adminUserData);
        
        toast.success("Login successful", {
          description: "Welcome to the admin dashboard."
        });
        
        return true;
      } else {
        toast.error("Login failed", {
          description: "Invalid username or password."
        });
        return false;
      }
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
