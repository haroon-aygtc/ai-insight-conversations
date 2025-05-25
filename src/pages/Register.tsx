import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  User,
  Mail,
  Lock,
  Building,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    jobTitle: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name: string, value: string): string | false => {
    switch (name) {
      case "email":
        return !/\S+@\S+\.\S+/.test(value)
          ? "Please enter a valid email address"
          : false;
      case "password":
        return value.length < 8
          ? "Password must be at least 8 characters"
          : false;
      case "confirmPassword":
        return value !== formData.password ? "Passwords do not match" : false;
      case "firstName":
      case "lastName":
        return value.trim() === "" ? "This field is required" : false;
      default:
        return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      const firstNameError = validateField("firstName", formData.firstName);
      const lastNameError = validateField("lastName", formData.lastName);
      const emailError = validateField("email", formData.email);

      if (firstNameError) newErrors.firstName = firstNameError;
      if (lastNameError) newErrors.lastName = lastNameError;
      if (emailError) newErrors.email = emailError;
    } else if (step === 2) {
      const passwordError = validateField("password", formData.password);
      const confirmPasswordError = validateField(
        "confirmPassword",
        formData.confirmPassword,
      );

      if (passwordError) newErrors.password = passwordError;
      if (confirmPasswordError)
        newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        console.log("Registration data:", formData);
        // Handle registration logic here
        window.location.href = "/dashboard";
      }, 1500);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Security", icon: Lock },
    { number: 3, title: "Company", icon: Building },
  ];

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-800/90 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Information */}
        <div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10"
          >
            <h1 className="text-4xl font-bold mb-6">Join Our Platform</h1>
            <p className="text-xl mb-8 text-indigo-100">
              Create your account and start building amazing experiences with
              our powerful tools.
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
                  <h3 className="font-semibold">Advanced Analytics</h3>
                  <p className="text-indigo-100">
                    Track and analyze your performance
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
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="text-indigo-100">
                    Get help whenever you need it
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
                  <h3 className="font-semibold">Secure & Reliable</h3>
                  <p className="text-indigo-100">Your data is safe with us</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-32 -right-16 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-lg dark:shadow-slate-900/30">
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
                            step.number !== steps.length ? "flex-1" : ""
                          }`}
                        >
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{
                              scale: currentStep >= step.number ? 1 : 0.8,
                              backgroundColor:
                                currentStep >= step.number
                                  ? "rgb(79, 70, 229)"
                                  : "transparent",
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                              currentStep >= step.number
                                ? "border-indigo-600 text-white"
                                : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                          {step.number !== steps.length && (
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{
                                scaleX: currentStep > step.number ? 1 : 0,
                                backgroundColor:
                                  currentStep > step.number
                                    ? "rgb(79, 70, 229)"
                                    : "rgb(229, 231, 235)",
                              }}
                              className="flex-1 h-1 mx-4 origin-left"
                              style={{ transformOrigin: "left" }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Step {currentStep} of {steps.length}:{" "}
                    {steps[currentStep - 1].title}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={formVariants}
                        className="space-y-4"
                      >
                        <h2 className="text-2xl font-bold text-foreground text-center mb-6">
                          Personal Information
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <div className="relative mt-1">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`pl-10 ${errors.firstName ? "border-red-500 dark:border-red-500" : ""}`}
                              />
                            </div>
                            {errors.firstName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.firstName}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <div className="relative mt-1">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`pl-10 ${errors.lastName ? "border-red-500 dark:border-red-500" : ""}`}
                              />
                            </div>
                            {errors.lastName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`pl-10 ${errors.email ? "border-red-500 dark:border-red-500" : ""}`}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={formVariants}
                        className="space-y-4"
                      >
                        <h2 className="text-2xl font-bold text-foreground text-center mb-6">
                          Set Your Password
                        </h2>

                        <div>
                          <Label htmlFor="password">Password</Label>
                          <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`pl-10 ${errors.password ? "border-red-500 dark:border-red-500" : ""}`}
                            />
                          </div>
                          {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.password}
                            </p>
                          )}
                          {!errors.password && formData.password && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                                <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                                <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-500">
                                  Strong
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword">
                            Confirm Password
                          </Label>
                          <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`pl-10 ${errors.confirmPassword ? "border-red-500 dark:border-red-500" : ""}`}
                            />
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={formVariants}
                        className="space-y-4"
                      >
                        <h2 className="text-2xl font-bold text-foreground text-center mb-6">
                          Company Details
                        </h2>

                        <div>
                          <Label htmlFor="company">Company Name</Label>
                          <div className="relative mt-1">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="company"
                              name="company"
                              type="text"
                              value={formData.company}
                              onChange={handleInputChange}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <div className="relative mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                            >
                              <path d="M2 20h.01"></path>
                              <path d="M7 20v-4"></path>
                              <path d="M12 20v-8"></path>
                              <path d="M17 20V8"></path>
                            </svg>
                            <Input
                              id="jobTitle"
                              name="jobTitle"
                              type="text"
                              value={formData.jobTitle}
                              onChange={handleInputChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft size={16} />
                        Back
                      </Button>
                    )}

                    <div className={currentStep > 1 ? "ml-auto" : "w-full"}>
                      {currentStep < steps.length ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
                          style={{ width: currentStep > 1 ? "auto" : "100%" }}
                        >
                          Next
                          <ArrowRight size={16} />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-primary hover:underline font-medium transition-colors"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
