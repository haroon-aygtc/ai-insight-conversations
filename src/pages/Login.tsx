import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CheckCircle, Mail, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, handle authentication here
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Information */}
        <div className="hidden lg:flex flex-col justify-center px-12 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10"
          >
            <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Sign in to access your dashboard and continue your journey with our AI-powered conversation platform.
            </p>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Smart Analytics</h3>
                  <p className="text-primary-foreground/80">
                    Gain insights from your conversations and data
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Always Available</h3>
                  <p className="text-primary-foreground/80">
                    24/7 support and reliable uptime for your business
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Enterprise Security</h3>
                  <p className="text-primary-foreground/80">Bank-level security for your sensitive data</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-32 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
              <p className="text-muted-foreground mt-2">
                Sign in to access your AI conversation platform
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <form onSubmit={handleLogin} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-5"
                  >
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                      <div className="relative mt-1.5">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          placeholder="your@email.com"
                          type="email"
                          autoComplete="email"
                          required
                          className="pl-10 transition-colors focus-visible:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                        <a
                          href="#"
                          className="text-xs text-primary hover:underline transition-colors font-medium"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="password"
                          placeholder="••••••••"
                          type="password"
                          autoComplete="current-password"
                          required
                          className="pl-10 transition-colors focus-visible:ring-primary"
                        />
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="pt-2"
                    >
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                        disabled={isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Signing you in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="text-primary hover:underline transition-colors font-medium"
                    >
                      Create one here
                    </a>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
