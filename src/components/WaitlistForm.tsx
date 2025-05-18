
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { submitWaitlistForm, WaitlistFormData } from '@/services/waitlistService';

const WaitlistForm: React.FC = () => {
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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, notifyCreatorTools: checked }));
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
    
    // Submit form data
    const success = await submitWaitlistForm(formData);
    
    if (success) {
      // Reset form on success
      setFormData({
        role: 'reader',
        email: '',
        mobile: '',
        notifyCreatorTools: false,
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <section id="waitlist" className="py-16 md:py-24 bg-gray-50">
      <div className="container px-4">
        <div className="max-w-lg mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-voomics-saffron to-voomics-red text-white rounded-t-lg">
              <CardTitle className="text-2xl md:text-3xl">Be first in line – it's free</CardTitle>
              <CardDescription className="text-white/90 mt-2">
                Join the Voomics waitlist to get early access!
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>I am a <span className="text-red-500">*</span></Label>
                    <RadioGroup 
                      value={formData.role} 
                      onValueChange={handleRoleChange as (value: string) => void}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reader" id="reader" />
                        <Label htmlFor="reader" className="cursor-pointer">Reader / Fan</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="creator" id="creator" />
                        <Label htmlFor="creator" className="cursor-pointer">Creator / Artist</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="yourname@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                    </div>
                    <div className="flex">
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
                      <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                    )}
                  </div>
                  
                  {formData.role === 'creator' && (
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="notify" 
                        checked={formData.notifyCreatorTools}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="notify"
                          className="text-sm font-normal leading-snug cursor-pointer"
                        >
                          Notify me about creator tools and opportunities
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <Button 
                    type="submit" 
                    className="w-full bg-voomics-red hover:bg-voomics-red/90 text-white py-6 h-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Count Me In"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4 text-center">
              <p className="text-sm text-gray-500">No spam. Opt out anytime.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;
