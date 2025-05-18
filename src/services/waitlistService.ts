
import { toast } from "sonner";

export interface WaitlistFormData {
  role: 'reader' | 'creator';
  email: string;
  mobile?: string;
  notifyCreatorTools?: boolean;
}

export const submitWaitlistForm = async (data: WaitlistFormData): Promise<boolean> => {
  try {
    // In a real implementation, this would be an API call to your backend
    // Example:
    // const response = await fetch('/api/waitlist', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to submit form');
    // }
    
    // For now, we'll simulate a successful submission
    console.log("Waitlist form data submitted:", data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
