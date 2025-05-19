
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WaitlistEntry {
  id: string;
  email: string;
  role: 'reader' | 'creator';
  mobile: string | null;
  notify_creator_tools: boolean | null;
  suggestions: string | null;
  story_idea: string | null;
  file_url: string | null;
  created_at: string;
}

export const fetchWaitlistData = async (): Promise<WaitlistEntry[]> => {
  try {
    console.log("Fetching waitlist data...");
    
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching waitlist data:", error);
      toast.error("Data fetch failed", {
        description: "Could not retrieve waitlist data."
      });
      return [];
    }
    
    console.log("Waitlist data retrieved:", data?.length || 0, "entries");
    return validateWaitlistData(data || []);
  } catch (error) {
    console.error("Waitlist data fetch error:", error);
    toast.error("Data error", {
      description: "An unexpected error occurred while fetching data."
    });
    return [];
  }
};

// Helper function to validate waitlist data
function validateWaitlistData(data: any[]): WaitlistEntry[] {
  return data.map(item => {
    // Ensure role is either 'reader' or 'creator'
    const validatedRole = item.role === 'reader' || item.role === 'creator' 
      ? item.role as 'reader' | 'creator' 
      : 'reader'; // Default to 'reader' if invalid
    
    return {
      id: item.id,
      email: item.email,
      role: validatedRole,
      mobile: item.mobile,
      notify_creator_tools: Boolean(item.notify_creator_tools),
      suggestions: item.suggestions,
      story_idea: item.story_idea,
      file_url: item.file_url,
      created_at: item.created_at
    } as WaitlistEntry;
  });
}

export const exportWaitlistToCsv = (waitlistData: WaitlistEntry[]): void => {
  if (!waitlistData.length) return;
  
  // Create CSV headers
  const headers = [
    "ID", 
    "Email", 
    "Role", 
    "Mobile", 
    "Notify Creator Tools", 
    "Suggestions", 
    "Story Idea", 
    "File URL", 
    "Created At"
  ].join(",");
  
  // Create CSV rows
  const rows = waitlistData.map(entry => [
    entry.id,
    entry.email,
    entry.role,
    entry.mobile || "",
    entry.notify_creator_tools ? "Yes" : "No",
    entry.suggestions ? `"${entry.suggestions.replace(/"/g, '""')}"` : "",
    entry.story_idea ? `"${entry.story_idea.replace(/"/g, '""')}"` : "",
    entry.file_url || "",
    entry.created_at
  ].join(","));
  
  // Combine headers and rows
  const csv = [headers, ...rows].join("\n");
  
  // Create download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `waitlist_data_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
