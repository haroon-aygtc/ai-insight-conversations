
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const Register = () => {
  const navigate = useNavigate();
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, handle registration here
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">ChatAdmin</h1>
          <p className="text-slate-500 mt-2">Create an account to get started</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill out the form below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  placeholder="your@email.com" 
                  type="email" 
                  autoComplete="email"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  autoComplete="new-password"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  placeholder="••••••••" 
                  type="password" 
                  autoComplete="new-password"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm text-slate-600"
                >
                  I agree to the{" "}
                  <a 
                    href="#" 
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </a>
                  {" "}and{" "}
                  <a 
                    href="#" 
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
              
              <div className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
