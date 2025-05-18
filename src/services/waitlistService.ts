
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WaitlistFormData {
  role: 'reader' | 'creator';
  email: string;
  mobile?: string;
  notifyCreatorTools?: boolean;
}

export const submitWaitlistForm = async (data: WaitlistFormData): Promise<boolean> => {
  try {
    // Format the data for Supabase insert
    const { email, mobile, role, notifyCreatorTools } = data;
    
    // Insert into Supabase waitlist table
    const { error } = await supabase
      .from('waitlist')
      .insert([
        { 
          email, 
          mobile: mobile || null, 
          role, 
          notify_creator_tools: notifyCreatorTools || false 
        }
      ]);
    
    if (error) {
      console.error("Error submitting waitlist form:", error);
      
      // Handle duplicate email error
      if (error.code === '23505') {
        toast.error("This email is already on the waitlist", {
          description: "Please use a different email or check your inbox for the confirmation."
        });
      } else {
        toast.error("Failed to submit form", {
          description: "Please try again later."
        });
      }
      
      return false;
    }
    
    // Show success message
    toast.success("Shukriya! Check your inbox for the confirmation link.", {
      description: "We're excited to have you join the Voomics community!"
    });
    
    return true;
  } catch (error) {
    console.error("Error submitting waitlist form:", error);
    
    // Show error message
    toast.error("Failed to submit form", {
      description: "Please try again later."
    });
    
    return false;
  }
};
