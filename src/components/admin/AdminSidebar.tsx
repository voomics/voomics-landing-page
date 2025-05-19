
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LayoutDashboard, ListPlus, Users, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isSidebarOpen: boolean;
}

export const AdminSidebar = ({ isSidebarOpen }: AdminSidebarProps) => {
  const { logout } = useAdminAuth();

  const navItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Waitlist",
      path: "/admin/waitlist",
      icon: <Users className="mr-2 h-4 w-4" />,
    }
  ];

  const sidebarClass = cn(
    "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-white transition-transform duration-300 md:static",
    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  return (
    <aside className={sidebarClass}>
      <div className="flex h-16 items-center px-6">
        <h2 className="text-lg font-bold">Voomics Admin</h2>
      </div>
      <div className="flex flex-1 flex-col space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            )}
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}
      </div>
      <div className="p-4">
        <Separator className="my-2" />
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
};
