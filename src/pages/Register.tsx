
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCheck, ArrowRight, ArrowLeft, User, Mail, Lock } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formStep, setFormStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    jobTitle: '',
    acceptTerms: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 0) {
      setFormStep(1);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to ChatAdmin. Please sign in with your credentials.",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Progress indicator calculation
  const getProgress = () => {
    if (formStep === 0) {
      const fields = [formData.firstName, formData.lastName, formData.email, formData.password, formData.confirmPassword];
      const filledFields = fields.filter(field => field.length > 0).length;
      return (filledFields / fields.length) * 100;
    } else {
      const fields = [formData.companyName, formData.jobTitle, formData.acceptTerms];
      const filledFields = fields.filter(field => field === true || field.length > 0).length;
      return (filledFields / fields.length) * 100;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-5">
          {/* Left side - Brand info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 flex flex-col justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">ChatAdmin</h1>
              <p className="text-indigo-100 mb-8">Simplify customer support with powerful AI</p>
              
              <div className="space-y-6 mt-12">
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <CheckCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Personalized Responses</h3>
                    <p className="text-indigo-100 text-sm">Our AI learns from your brand voice to deliver consistent customer service</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <CheckCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Easy Integration</h3>
                    <p className="text-indigo-100 text-sm">Add our widget to your website with a single line of code</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <CheckCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Actionable Insights</h3>
                    <p className="text-indigo-100 text-sm">Get detailed analytics to understand customer needs better</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-8">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="italic text-sm text-indigo-100">"ChatAdmin helped us reduce response time by 78% and improved customer satisfaction scores significantly."</p>
                <div className="mt-3 flex items-center">
                  <div className="w-8 h-8 bg-white/30 rounded-full mr-2"></div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-indigo-200">CTO, TechSolutions Inc.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Registration form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 p-8"
          >
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {formStep === 0 ? "Create your account" : "Complete your profile"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {formStep === 0 
                      ? "Start with your personal information" 
                      : "Just a few more details to set up your workspace"}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Step {formStep + 1} of 2
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500 ease-in-out"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              
              <form onSubmit={handleRegister} className="space-y-5">
                {formStep === 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input 
                            id="firstName" 
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange} 
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input 
                            id="lastName" 
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="pl-10" 
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input 
                          id="email" 
                          placeholder="you@company.com" 
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input 
                          id="password" 
                          placeholder="Create a secure password" 
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-10" 
                          required
                        />
                        <button 
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters with uppercase, lowercase, and number
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input 
                          id="confirmPassword" 
                          placeholder="Confirm your password" 
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 pr-10" 
                          required
                        />
                        <button 
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-gray-700 font-medium">Company / Organization</Label>
                      <Input 
                        id="companyName" 
                        placeholder="Your company name"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-gray-700 font-medium">Job Title</Label>
                      <Input 
                        id="jobTitle" 
                        placeholder="Your position"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCheck className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-800">
                            Almost there!
                          </p>
                          <p className="mt-1 text-sm text-blue-600">
                            We'll guide you through setting up your first chatbot after registration.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="acceptTerms" 
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, acceptTerms: checked === true})}
                    required
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-600 leading-none"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
                
                <div className="pt-2 space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : formStep === 0 ? (
                      <div className="flex items-center justify-center">
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  
                  {formStep === 1 && (
                    <button 
                      type="button"
                      className="flex items-center justify-center w-full text-sm text-indigo-600 hover:text-indigo-700" 
                      onClick={() => setFormStep(0)}
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" /> Go back to previous step
                    </button>
                  )}
                </div>
                
                <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                  Already have an account?{" "}
                  <a href="/login" className="text-indigo-600 font-medium hover:underline">
                    Sign in
                  </a>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
