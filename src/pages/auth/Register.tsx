import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Mail,
  Lock,
  Phone,
  Leaf,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name: string, value: string | boolean): string | false => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (typeof value === "string" && !/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email address";
        return false;
      case "phone":
        if (!value) return "Phone number is required";
        if (typeof value === "string" && !/^\+?[\d\s\-\(\)]+$/.test(value)) return "Please enter a valid phone number";
        return false;
      case "password":
        if (!value) return "Password is required";
        if (typeof value === "string" && value.length < 8) return "Password must be at least 8 characters";
        return false;
      case "password_confirmation":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return false;
      case "first_name":
      case "last_name":
        if (!value || (typeof value === "string" && value.trim() === "")) return "This field is required";
        return false;
      case "agreeToTerms":
        if (!value) return "You must agree to the terms and conditions";
        return false;
      default:
        return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate all required fields
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${formData.first_name} ${formData.last_name}`;
      await register(formData.email, formData.password, fullName);
      toast({
        title: "Registration successful",
        description: "Welcome to AI Insights!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-4xl font-bold mb-6">Join Our Community</h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Create your account and start your journey with our innovative AI-powered platform designed for growth and success.
            </p>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Sustainable Growth</h3>
                  <p className="text-primary-foreground/80">
                    Build lasting success with eco-friendly solutions
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
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Enterprise Security</h3>
                  <p className="text-primary-foreground/80">
                    Your data is protected with industry-leading security
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
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Collaborative Platform</h3>
                  <p className="text-primary-foreground/80">Connect and collaborate with teams worldwide</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-32 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
              <p className="text-muted-foreground mt-2">
                Join our community and unlock powerful AI-driven conversations
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-foreground">Create Your Account</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Join thousands of professionals already using our platform
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-5"
                  >
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="first_name" className="text-sm font-medium text-foreground">First Name</Label>
                          <div className="relative mt-1.5">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="first_name"
                              name="first_name"
                              type="text"
                              placeholder="John"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className={`pl-10 transition-colors ${errors.first_name ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}`}
                            />
                          </div>
                          {errors.first_name && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.first_name}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="last_name" className="text-sm font-medium text-foreground">Last Name</Label>
                          <div className="relative mt-1.5">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="last_name"
                              name="last_name"
                              type="text"
                              placeholder="Doe"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className={`pl-10 transition-colors ${errors.last_name ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}`}
                            />
                          </div>
                          {errors.last_name && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.last_name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                        <div className="relative mt-1.5">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john.doe@company.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`pl-10 transition-colors ${errors.email ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                        <div className="relative mt-1.5">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`pl-10 transition-colors ${errors.phone ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Security Section */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                          <div className="relative mt-1.5">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`pl-10 transition-colors ${errors.password ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}`}
                            />
                          </div>
                          {errors.password && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.password}
                            </p>
                          )}
                          {!errors.password && formData.password && formData.password.length >= 8 && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <div className="h-1 flex-1 bg-primary rounded-full"></div>
                                <div className="h-1 flex-1 bg-primary rounded-full"></div>
                                <div className="h-1 flex-1 bg-secondary rounded-full"></div>
                                <span className="text-xs text-primary font-medium">
                                  Strong
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">Confirm Password</Label>
                          <div className="relative mt-1.5">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="password_confirmation"
                              name="password_confirmation"
                              type="password"
                              placeholder="••••••••"
                              value={formData.password_confirmation}
                              onChange={handleInputChange}
                              className={`pl-10 transition-colors ${errors.password_confirmation ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}`}
                            />
                          </div>
                          {errors.password_confirmation && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.password_confirmation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeToTerms"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) =>
                            handleInputChange({
                              target: { name: "agreeToTerms", type: "checkbox", checked }
                            } as React.ChangeEvent<HTMLInputElement>)
                          }
                          className={`mt-0.5 ${errors.agreeToTerms ? "border-destructive" : ""}`}
                        />
                        <div className="text-sm">
                          <Label htmlFor="agreeToTerms" className="text-foreground cursor-pointer">
                            I agree to the{" "}
                            <a href="#" className="text-primary hover:underline font-medium">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-primary hover:underline font-medium">
                              Privacy Policy
                            </a>
                          </Label>
                          {errors.agreeToTerms && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.agreeToTerms}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="pt-6"
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
                          Creating Your Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-8 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-primary hover:underline font-medium transition-colors"
                    >
                      Sign in here
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

export default Register;
