import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, User, Shield, Building, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import userService, { UserCreateData, UserUpdateData } from "@/services/userService";
import roleService from "@/services/roleService";
import { User as UserType } from "@/services/auth";

interface Role {
  id: number;
  name: string;
  description?: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  roles: string[];
}

const UserRoleWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPermissionSync } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [existingUser, setExistingUser] = useState<UserType | null>(null);

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    roles: []
  });

  const isEditMode = !!id;

  // Check permissions
  const canCreateUsers = hasPermissionSync('user.create');
  const canEditUsers = hasPermissionSync('user.edit');

  // Permission check
  if (isEditMode && !canEditUsers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to edit users.
          </p>
        </div>
      </div>
    );
  }

  if (!isEditMode && !canCreateUsers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to create users.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch roles
        const rolesResponse = await roleService.getRoles();

        // Ensure roles is properly set as an array
        if (rolesResponse && Array.isArray(rolesResponse)) {
          setRoles(rolesResponse);
        } else {
          console.error('Unexpected roles format:', rolesResponse);
          setRoles([]);
        }

        // Fetch existing user if editing
        if (isEditMode && id) {
          const userResponse = await userService.getUser(id);
          setExistingUser(userResponse);
          setFormData({
            first_name: userResponse.first_name,
            last_name: userResponse.last_name,
            email: userResponse.email,
            phone: userResponse.phone || "",
            password: "",
            password_confirmation: "",
            roles: userResponse.roles.map(role => typeof role === 'string' ? role : role.name)
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, toast]);

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Role & Access", icon: Shield },
    { number: 3, title: "Review", icon: CheckCircle }
  ];

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          return false;
        }
        if (!isEditMode && (!formData.password || formData.password.length < 8)) {
          toast({
            title: "Invalid Password",
            description: "Password must be at least 8 characters long",
            variant: "destructive"
          });
          return false;
        }
        if (!isEditMode && formData.password !== formData.password_confirmation) {
          toast({
            title: "Password Mismatch",
            description: "Passwords do not match",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        if (formData.roles.length === 0) {
          toast({
            title: "Missing Role",
            description: "Please select at least one role",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleSave = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    try {
      setSaving(true);

      if (isEditMode && id) {
        const updateData: UserUpdateData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          roles: formData.roles
        };

        if (formData.password && formData.password.trim()) {
          updateData.password = formData.password;
          updateData.password_confirmation = formData.password_confirmation;
        }

        await userService.updateUser(id, updateData);

        toast({
          title: "Success!",
          description: `User ${formData.first_name} ${formData.last_name} has been updated successfully.`
        });
      } else {
        const createData: UserCreateData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password!,
          password_confirmation: formData.password_confirmation!,
          roles: formData.roles
        };

        await userService.createUser(createData);

        toast({
          title: "Success!",
          description: `User ${formData.first_name} ${formData.last_name} has been created successfully.`
        });
      }

      navigate("/users");
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: "Failed to save user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (roleName: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter(r => r !== roleName)
        : [...prev.roles, roleName]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Update User" : "Add New User"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Make changes to user details" : "Create a new user account step by step"}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step.number
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                  }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                    }`}>
                    Step {step.number}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-px mx-4 ${currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <p className="text-muted-foreground mb-4">Enter the user's basic details</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="John"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Smith"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.smith@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>
              </div>
              {!isEditMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password_confirmation">Confirm Password *</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      placeholder="Confirm password"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
              {isEditMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">New Password (optional)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Leave blank to keep current password"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      placeholder="Confirm new password"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Role & Permissions</h3>
                <p className="text-muted-foreground mb-4">Choose what this user can do</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.isArray(roles) && roles.map((role) => (
                  <Card
                    key={role.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${formData.roles.includes(role.name) ? "ring-2 ring-primary shadow-md" : ""
                      }`}
                    onClick={() => toggleRole(role.name)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 mt-1 text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{role.name}</h4>
                            {formData.roles.includes(role.name) && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {role.description || `${role.name} role permissions`}
                          </p>
                          <Badge
                            className="mt-2"
                            variant={formData.roles.includes(role.name) ? "default" : "secondary"}
                          >
                            {role.name}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {formData.roles.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Selected Roles:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.roles.map((roleName) => (
                      <Badge key={roleName} variant="default">
                        {roleName}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRole(roleName);
                          }}
                          className="ml-2 hover:bg-red-600 rounded-full"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
                <p className="text-muted-foreground mb-4">Please review the information before saving</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-lg font-medium">{formData.first_name} {formData.last_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-lg font-medium">{formData.email}</p>
                  </div>
                  {formData.phone && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-lg font-medium">{formData.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Roles</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.roles.map((roleName) => (
                        <Badge key={roleName} variant="default">
                          <Shield className="h-3 w-3 mr-1" />
                          {roleName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {!isEditMode && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> A password will be set for this user. They will be able to log in immediately after creation.
                    </p>
                  </div>
                )}
                {isEditMode && formData.password && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> The user's password will be updated.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/users")}>
            Cancel
          </Button>
          {currentStep < 3 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditMode ? "Save Changes" : "Create User"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRoleWizard;
