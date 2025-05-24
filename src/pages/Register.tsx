
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, User, Mail, Lock, Building } from 'lucide-react';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string | false => {
    switch (name) {
      case 'email':
        return !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email address' : false;
      case 'password':
        return value.length < 8 ? 'Password must be at least 8 characters' : false;
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : false;
      case 'firstName':
      case 'lastName':
        return value.trim() === '' ? 'This field is required' : false;
      default:
        return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      const firstNameError = validateField('firstName', formData.firstName);
      const lastNameError = validateField('lastName', formData.lastName);
      const emailError = validateField('email', formData.email);
      
      if (firstNameError) newErrors.firstName = firstNameError;
      if (lastNameError) newErrors.lastName = lastNameError;
      if (emailError) newErrors.email = emailError;
    } else if (step === 2) {
      const passwordError = validateField('password', formData.password);
      const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
      
      if (passwordError) newErrors.password = passwordError;
      if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      console.log('Registration data:', formData);
      // Handle registration logic here
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Security', icon: Lock },
    { number: 3, title: 'Company', icon: Building }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Information */}
        <div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-6">Join Our Platform</h1>
            <p className="text-xl mb-8 text-indigo-100">
              Create your account and start building amazing experiences with our powerful tools.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Advanced Analytics</h3>
                  <p className="text-indigo-100">Track and analyze your performance</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="text-indigo-100">Get help whenever you need it</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure & Reliable</h3>
                  <p className="text-indigo-100">Your data is safe with us</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex items-center justify-center p-8">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardContent className="p-8">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.number}
                        className={`flex items-center ${
                          step.number !== steps.length ? 'flex-1' : ''
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            currentStep >= step.number
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-gray-300 text-gray-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {step.number !== steps.length && (
                          <div
                            className={`flex-1 h-1 mx-4 transition-all ${
                              currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-sm text-gray-600">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                      Personal Information
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={errors.firstName ? 'border-red-500' : ''}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                      Set Your Password
                    </h2>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? 'border-red-500' : ''}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                      Company Details
                    </h2>
                    
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    {currentStep < steps.length ? (
                      <Button type="button" onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700">
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                        Create Account
                      </Button>
                    )}
                  </div>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="/login" className="text-indigo-600 hover:underline font-medium">
                    Sign in
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
