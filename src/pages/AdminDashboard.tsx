
import { useState, useEffect } from "react";
import { fetchWaitlistData, WaitlistEntry } from "@/services/waitlistService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { WaitlistCharts } from "@/components/admin/WaitlistCharts";

const AdminDashboard = () => {
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchWaitlistData();
        setWaitlistData(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Voomics admin dashboard. Here's an overview of your waitlist data.
        </p>
      </div>
      
      <DashboardStats waitlistData={waitlistData} />
      
      <WaitlistCharts waitlistData={waitlistData} />
    </div>
  );
};

export default AdminDashboard;
