
import { useState, useEffect } from "react";
import { fetchWaitlistData, WaitlistEntry } from "@/services/waitlistService";
import { Loader2 } from "lucide-react";
import { WaitlistTable } from "@/components/admin/WaitlistTable";

const AdminWaitlist = () => {
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
        <h1 className="mb-2 text-3xl font-bold">Waitlist Entries</h1>
        <p className="text-muted-foreground">
          View and manage all waitlist registrations.
        </p>
      </div>
      
      <WaitlistTable waitlistData={waitlistData} />
    </div>
  );
};

export default AdminWaitlist;
