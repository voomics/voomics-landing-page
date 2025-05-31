
import { useState, useEffect } from "react";
import { fetchWaitlistData, WaitlistEntry } from "@/services/waitlistService";
import { Loader2 } from "lucide-react";
import { WaitlistTable } from "@/components/admin/WaitlistTable";

const AdminWaitlist = () => {
  console.log("📋 AdminWaitlist component rendered");
  
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("📋 AdminWaitlist useEffect triggered");
    
    const loadData = async () => {
      try {
        console.log("📋 Starting to load waitlist data...");
        const data = await fetchWaitlistData();
        console.log("📋 Waitlist data loaded:", data);
        console.log("📋 Number of entries received:", data.length);
        setWaitlistData(data);
      } catch (error) {
        console.error("💥 Error loading waitlist data:", error);
      } finally {
        console.log("📋 Setting loading to false");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  console.log("📋 AdminWaitlist current state:", { 
    waitlistDataLength: waitlistData.length, 
    isLoading,
    hasData: waitlistData.length > 0
  });

  if (isLoading) {
    console.log("📋 AdminWaitlist showing loading spinner");
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  console.log("📋 AdminWaitlist rendering main content with data:", waitlistData);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Waitlist Entries</h1>
        <p className="text-muted-foreground">
          View and manage all waitlist registrations.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Debug: Found {waitlistData.length} entries
        </p>
      </div>
      
      <WaitlistTable waitlistData={waitlistData} />
    </div>
  );
};

export default AdminWaitlist;
