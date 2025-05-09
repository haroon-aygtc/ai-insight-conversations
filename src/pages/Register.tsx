
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formStep, setFormStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Brand info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col justify-center p-6 text-center md:text-left"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ChatAdmin</h1>
            <p className="text-xl text-gray-600">Simplify customer support with powerful AI</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">✨ Personalized Responses</h3>
              <p className="text-gray-600">Our AI learns from your brand voice to deliver consistent customer service</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">🚀 Easy Integration</h3>
              <p className="text-gray-600">Add our widget to your website with a single line of code</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">📊 Actionable Insights</h3>
              <p className="text-gray-600">Get detailed analytics to understand customer needs better</p>
            </div>
          </div>
        </motion.div>
        
        {/* Right side - Registration form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-xl"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
            <p className="text-gray-500 mt-1">
              {formStep === 0 
                ? "Let's get started with your personal information" 
                : "Just a few more details to complete your setup"}
            </p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-5">
            {formStep === 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange} 
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input 
                    id="email" 
                    placeholder="you@company.com" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input 
                    id="password" 
                    placeholder="Create a secure password" 
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters with uppercase, lowercase, and number
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    placeholder="Confirm your password" 
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-700">Company / Organization</Label>
                  <Input 
                    id="companyName" 
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-gray-700">Job Title</Label>
                  <Input 
                    id="jobTitle" 
                    placeholder="Your position"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Almost there!</strong> We'll guide you through setting 
                    up your first chatbot after registration.
                  </p>
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
                className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <div>
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all"
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
                ) : formStep === 0 ? "Continue" : "Create Account"}
              </Button>
            </div>
            
            {formStep === 1 && (
              <div className="text-center">
                <button 
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700" 
                  onClick={() => setFormStep(0)}
                >
                  ← Go back to previous step
                </button>
              </div>
            )}
            
            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 font-medium hover:underline">
                Sign in
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
