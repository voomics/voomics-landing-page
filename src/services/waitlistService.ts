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

export interface WaitlistFormData {
  role: 'reader' | 'creator';
  email: string;
  mobile: string;
  notifyCreatorTools: boolean;
  suggestions: string;
  storyIdea: string;
  hasAttachment: boolean;
}

export const fetchWaitlistData = async (): Promise<WaitlistEntry[]> => {
  try {
    console.log("🔄 Starting fetchWaitlistData...");
    console.log("📊 Supabase client status:", supabase ? "✅ Available" : "❌ Missing");
    
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
      
    console.log("📡 Supabase query completed");
    console.log("📊 Raw response data:", data);
    console.log("❌ Query error:", error);
    
    if (error) {
      console.error("💥 Error fetching waitlist data:", error);
      console.error("💥 Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast.error("Data fetch failed", {
        description: "Could not retrieve waitlist data."
      });
      return [];
    }
    
    console.log("✅ Waitlist data retrieved successfully");
    console.log("📈 Number of entries:", data?.length || 0);
    console.log("📋 First entry sample:", data?.[0]);
    
    const validatedData = validateWaitlistData(data || []);
    console.log("✅ Data validation completed");
    console.log("📊 Validated entries count:", validatedData.length);
    
    return validatedData;
  } catch (error) {
    console.error("💥 Waitlist data fetch error:", error);
    console.error("💥 Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    toast.error("Data error", {
      description: "An unexpected error occurred while fetching data."
    });
    return [];
  }
};

// Helper function to validate waitlist data
function validateWaitlistData(data: any[]): WaitlistEntry[] {
  console.log("🔍 Starting data validation...");
  console.log("📊 Input data length:", data.length);
  
  const validated = data.map((item, index) => {
    console.log(`🔍 Validating item ${index}:`, item);
    
    // Ensure role is either 'reader' or 'creator'
    const validatedRole = item.role === 'reader' || item.role === 'creator' 
      ? item.role as 'reader' | 'creator' 
      : 'reader'; // Default to 'reader' if invalid
    
    if (item.role !== validatedRole) {
      console.warn(`⚠️ Invalid role '${item.role}' for item ${index}, defaulting to 'reader'`);
    }
    
    const validated = {
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
    
    console.log(`✅ Validated item ${index}:`, validated);
    return validated;
  });
  
  console.log("✅ All data validated successfully");
  return validated;
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

export const submitWaitlistForm = async (
  formData: WaitlistFormData,
  file: File | null
): Promise<boolean> => {
  try {
    console.log("Submitting waitlist form...", formData);
    
    let fileUrl = null;
    
    // Upload file if present
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `waitlist/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        toast.error("File upload failed", {
          description: "Could not upload your attachment."
        });
        return false;
      }
      
      // Get public URL for the file
      const { data } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);
        
      fileUrl = data.publicUrl;
    }
    
    // Insert record into waitlist table
    const { error } = await supabase
      .from('waitlist')
      .insert({
        email: formData.email,
        role: formData.role,
        mobile: formData.mobile || null,
        notify_creator_tools: formData.notifyCreatorTools,
        suggestions: formData.role === 'reader' ? formData.suggestions : null,
        story_idea: formData.role === 'creator' ? formData.storyIdea : null,
        file_url: fileUrl
      });
      
    if (error) {
      console.error("Error inserting waitlist entry:", error);
      toast.error("Registration failed", {
        description: "Could not add you to the waitlist. Please try again."
      });
      return false;
    }
    
    toast.success("Registration successful", {
      description: "You've been added to the waitlist!"
    });
    
    return true;
  } catch (error) {
    console.error("Waitlist form submission error:", error);
    toast.error("Registration error", {
      description: "An unexpected error occurred. Please try again later."
    });
    return false;
  }
};
