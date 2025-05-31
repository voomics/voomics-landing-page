
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

export const useAdminAuth = () => {
  console.log("🔐 useAdminAuth hook called");
  const context = useContext(AdminAuthContext);
  console.log("🔐 Admin auth context:", context);
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("🔐 AdminAuthProvider rendered with state:", { adminUser, isLoading });

  useEffect(() => {
    console.log("🔐 AdminAuthProvider useEffect triggered");
    // Check for existing session
    const checkSession = async () => {
      try {
        console.log("🔐 Checking existing admin session...");
        const storedUser = localStorage.getItem('admin_user');
        console.log("🔐 Stored user from localStorage:", storedUser);
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("🔐 Parsed user data:", parsedUser);
          setAdminUser(parsedUser);
        } else {
          console.log("🔐 No stored user found");
        }
      } catch (error) {
        console.error("💥 Error checking admin session:", error);
        localStorage.removeItem('admin_user');
      } finally {
        console.log("🔐 Session check completed, setting isLoading to false");
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("🔐 Login attempt for username:", username);
      setIsLoading(true);
      
      // Simple username/password check
      if (username === "raja" && password === "raja") {
        console.log("✅ Login credentials valid");
        const adminUserData: AdminUser = {
          id: "admin-raja",
          email: "raja@admin.com"
        };
        
        console.log("🔐 Storing admin user data:", adminUserData);
        localStorage.setItem('admin_user', JSON.stringify(adminUserData));
        setAdminUser(adminUserData);
        
        toast.success("Login successful", {
          description: "Welcome to the admin dashboard."
        });
        
        return true;
      } else {
        console.log("❌ Invalid login credentials");
        toast.error("Login failed", {
          description: "Invalid username or password."
        });
        return false;
      }
    } catch (error) {
      console.error("💥 Login error:", error);
      toast.error("Login error", {
        description: "An unexpected error occurred."
      });
      return false;
    } finally {
      console.log("🔐 Login process completed, setting isLoading to false");
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("🔐 Logout initiated");
      setIsLoading(true);
      localStorage.removeItem('admin_user');
      setAdminUser(null);
      console.log("🔐 Admin user logged out successfully");
      
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("💥 Logout error:", error);
      toast.error("Logout error", {
        description: "An unexpected error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log("🔐 AdminAuthProvider providing context with:", { adminUser, isLoading });

  return (
    <AdminAuthContext.Provider value={{ adminUser, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
