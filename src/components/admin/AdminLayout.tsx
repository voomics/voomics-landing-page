
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { Loader2 } from "lucide-react";

const AdminLayout = () => {
  const { adminUser, isLoading } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!adminUser) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <AdminSidebar isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Overlay for closing sidebar on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 md:hidden" 
          onClick={toggleSidebar} 
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AdminLayout;
