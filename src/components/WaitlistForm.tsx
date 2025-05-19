
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { submitWaitlistForm, WaitlistFormData } from '@/services/waitlistService';
import { Mail } from 'lucide-react';

const WaitlistForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<WaitlistFormData>({
    role: 'reader',
    email: '',
    mobile: '',
    notifyCreatorTools: false,
    suggestions: '',
    storyIdea: '',
    hasAttachment: false,
  });
  const [errors, setErrors] = useState<{
    email?: string;
    mobile?: string;
    file?: string;
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

  const validateFile = (file: File | null) => {
    if (!file) return true; // File is optional
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPEG, PNG, GIF or PDF file';
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (value: 'reader' | 'creator') => {
    setFormData(prev => ({ 
      ...prev, 
      role: value,
      // Reset role-specific fields when switching roles
      suggestions: value === 'reader' ? prev.suggestions : '',
      storyIdea: value === 'creator' ? prev.storyIdea : '',
      hasAttachment: false
    }));
    
    // Clear selected file when role changes
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, notifyCreatorTools: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    const validation = validateFile(file);
    if (typeof validation === 'string') {
      setErrors(prev => ({ ...prev, file: validation }));
    } else {
      setErrors(prev => ({ ...prev, file: undefined }));
      setFormData(prev => ({ ...prev, hasAttachment: !!file }));
    }
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
    
    const fileValidation = validateFile(selectedFile);
    if (typeof fileValidation === 'string') {
      newErrors.file = fileValidation;
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Submit form data
    const success = await submitWaitlistForm(formData, selectedFile);
    
    if (success) {
      // Reset form on success
      setFormData({
        role: 'reader',
        email: '',
        mobile: '',
        notifyCreatorTools: false,
        suggestions: '',
        storyIdea: '',
        hasAttachment: false,
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
                  
                  {/* Role-specific fields */}
                  {formData.role === 'reader' && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="suggestions">Suggestions / Feature Requests</Label>
                        <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                      </div>
                      <Textarea
                        id="suggestions"
                        name="suggestions"
                        placeholder="Share your ideas and what you'd like to see in Voomics"
                        value={formData.suggestions}
                        onChange={handleChange}
                        className="min-h-[100px]"
                      />
                    </div>
                  )}
                  
                  {formData.role === 'creator' && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="storyIdea">Your Story / Web Comics Idea</Label>
                          <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                        </div>
                        <Textarea
                          id="storyIdea"
                          name="storyIdea"
                          placeholder="Tell us about your unique story or webcomic idea"
                          value={formData.storyIdea}
                          onChange={handleChange}
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Label htmlFor="attachment">Attach Your Work</Label>
                          <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                        </div>
                        <Input
                          id="attachment"
                          name="attachment"
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png,.gif,.pdf"
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500">
                          Max file size: 5MB. Supported formats: JPEG, PNG, GIF, PDF
                        </p>
                        {errors.file && (
                          <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                        )}
                        {selectedFile && (
                          <p className="text-sm text-green-600">
                            File selected: {selectedFile.name}
                          </p>
                        )}
                      </div>
                      
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
                    </>
                  )}

                  {/* Contact information shown for both roles */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-start space-x-3">
                    <Mail className="text-voomics-indigo mt-1" />
                    <div>
                      <p className="text-sm font-medium">Need more information?</p>
                      <p className="text-sm text-gray-600">
                        Email us at <a href="mailto:raja@voomics.com" className="text-voomics-red hover:underline">raja@voomics.com</a>
                      </p>
                    </div>
                  </div>
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
