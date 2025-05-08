
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, handle authentication here
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">ChatAdmin</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your AI chat platform</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a 
                    href="#" 
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  autoComplete="current-password"
                  required
                />
              </div>
              
              <div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </div>
              
              <div className="text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <a 
                  href="/register" 
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
