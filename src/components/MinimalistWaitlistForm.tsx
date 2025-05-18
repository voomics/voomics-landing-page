
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitWaitlistForm, WaitlistFormData } from '@/services/waitlistService';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MinimalistWaitlistForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WaitlistFormData>({
    role: 'reader',
    email: '',
    mobile: '',
    notifyCreatorTools: false,
  });
  const [errors, setErrors] = useState<{
    email?: string;
    mobile?: string;
  }>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobile = (mobile: string) => {
    if (!mobile) return true; // Mobile is optional
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (value: 'reader' | 'creator') => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: typeof errors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.mobile && !validateMobile(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store in Supabase
      const { error } = await supabase
        .from('waitlist')
        .insert([{
          email: formData.email,
          mobile: formData.mobile || null,
          role: formData.role,
          notify_creator_tools: formData.role === 'creator' ? formData.notifyCreatorTools : false
        }]);

      if (error) throw error;
      
      // Show success message
      toast.success("Shukriya! You're on the waitlist.", {
        description: "We're excited to have you join the Voomics community!"
      });
      
      // Reset form on success
      setFormData({
        role: 'reader',
        email: '',
        mobile: '',
        notifyCreatorTools: false,
      });
    } catch (error) {
      console.error("Error submitting waitlist form:", error);
      toast.error("Something went wrong", {
        description: "Please try again or contact support."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-16 bg-gray-50">
      <div className="container px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-voomics-indigo text-center">Join the Waitlist</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="text-sm font-medium text-gray-700">I am a <span className="text-red-500">*</span></Label>
                  <RadioGroup 
                    value={formData.role} 
                    onValueChange={handleRoleChange as (value: string) => void}
                    className="flex space-x-4 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reader" id="reader" />
                      <Label htmlFor="reader" className="cursor-pointer text-sm">Reader</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="creator" id="creator" />
                      <Label htmlFor="creator" className="cursor-pointer text-sm">Creator</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="yourname@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center">
                    <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number</Label>
                    <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                  </div>
                  <div className="flex mt-1">
                    <div className="bg-gray-100 px-3 flex items-center border border-r-0 rounded-l-md">
                      <span className="text-sm">🇮🇳 +91</span>
                    </div>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="10-digit number"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`rounded-l-none ${errors.mobile ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-voomics-red hover:bg-voomics-red/90 text-white py-2.5 h-auto font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Join Waitlist"}
                </Button>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  No spam. Opt out anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MinimalistWaitlistForm;
