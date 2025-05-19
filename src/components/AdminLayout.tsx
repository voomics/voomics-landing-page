
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAdminUser, adminLogout } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AdminLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getAdminUser();
    if (!user) {
      navigate("/admin");
      return;
    }
    
    setAdminUser(user);
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Voomics Admin</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="container p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
