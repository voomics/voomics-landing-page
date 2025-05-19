
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Menu } from "lucide-react";
import { useState } from "react";

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const { adminUser, logout } = useAdminAuth();
  
  return (
    <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Voomics Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          {adminUser && (
            <div className="hidden items-center gap-2 md:flex">
              <div className="text-right">
                <p className="text-sm font-medium">{adminUser.email}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          )}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
