import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileText, Shield, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import roleService, { Role, RoleCreateData, RoleUpdateData, GroupedPermissions } from "@/services/roleService";
import permissionService from "@/services/permissionService";

const RoleWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPermissionSync } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingRole, setExistingRole] = useState<Role | null>(null);
  const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermissions>({});

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    permissions: string[];
  }>({
    name: "",
    description: "",
    permissions: []
  });

  const isEditMode = !!id;

  // Check permissions (using dynamic permission names)
  const canCreateRoles = hasPermissionSync('role.create');
  const canEditRoles = hasPermissionSync('role.edit');

  // Permission check
  if (isEditMode && !canEditRoles) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to edit roles.
          </p>
        </div>
      </div>
    );
  }

  if (!isEditMode && !canCreateRoles) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to create roles.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Always fetch permissions first
        console.log('Fetching permissions...');
        const permissionsResponse = await roleService.getPermissions();
        console.log('Permissions response:', permissionsResponse);

        if (permissionsResponse && permissionsResponse.groupedPermissions) {
          setGroupedPermissions(permissionsResponse.groupedPermissions);
          console.log('Grouped permissions set:', permissionsResponse.groupedPermissions);
        } else {
          console.error('Invalid permissions response structure:', permissionsResponse);
        }

        // Fetch existing role if editing
        if (isEditMode && id) {
          console.log('Fetching role for edit mode, ID:', id);
          const roleResponse = await roleService.getRole(id);
          console.log('Role response:', roleResponse);
          setExistingRole(roleResponse);

          // Handle case where permissions_list might be null or undefined
          const permissionsList = Array.isArray(roleResponse.permissions_list)
            ? roleResponse.permissions_list
            : [];

          console.log('Setting form data with permissions:', permissionsList);
          setFormData({
            name: roleResponse.name || "",
            description: roleResponse.description || "",
            permissions: permissionsList
          });
        } else {
          console.log('Create mode - no existing role to fetch');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load role data. Please try again.",
          variant: "destructive",
        });
        // Navigate back on error
        navigate("/roles");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, toast, navigate]);

  const steps = [
    { number: 1, title: "Basic Info", icon: FileText },
    { number: 2, title: "Permissions", icon: Shield },
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
        if (!formData.name.trim()) {
          toast({
            title: "Missing Information",
            description: "Role name is required",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        if (!formData.permissions || formData.permissions.length === 0) {
          toast({
            title: "Missing Permissions",
            description: "Please select at least one permission",
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
        const updateData: RoleUpdateData = {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        };

        await roleService.updateRole(id, updateData);

        toast({
          title: "Success!",
          description: `Role "${formData.name}" has been updated successfully.`
        });
      } else {
        const createData: RoleCreateData = {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        };

        await roleService.createRole(createData);

        toast({
          title: "Success!",
          description: `Role "${formData.name}" has been created successfully.`
        });
      }

      // Navigate to roles page with a small delay to allow toast to be seen
      setTimeout(() => navigate("/roles"), 100);
    } catch (error: any) {
      console.error('Error saving role:', error);

      // Display more specific error if available
      const errorMessage = error.response?.data?.message ||
        "Failed to save role. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
        <Button variant="ghost" onClick={() => navigate("/roles")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Update Role" : "Create New Role"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Modify role settings and permissions" : "Set up a new role with specific permissions"}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
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
            <div className="max-w-2xl mx-auto">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pb-6">
                  <CardTitle className="text-xl font-semibold">Role Details</CardTitle>
                  <CardDescription className="text-base">
                    {isEditMode
                      ? "Update the role name and description to reflect its purpose"
                      : "Give your role a clear name and description that reflects its purpose"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Role Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Content Manager, Support Agent, Administrator"
                      className="h-11"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Choose a descriptive name that clearly identifies the role's purpose
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of what this role can do and its responsibilities"
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Provide additional context about this role's responsibilities
                    </p>
                  </div>

                  {isEditMode && existingRole && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Editing Existing Role
                          </h4>
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            You are currently editing the "{existingRole.name}" role.
                            {existingRole.user_count && existingRole.user_count > 0 && (
                              <span> This role is currently assigned to {existingRole.user_count} user(s).</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b">
                <h3 className="text-xl font-semibold mb-2">Permission Configuration</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {isEditMode
                    ? "Review and modify the permissions for this role. Current permissions are already selected."
                    : "Select the permissions this role should have. You can select entire categories or individual permissions."
                  }
                </p>
                {isEditMode && formData.permissions.length > 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
                    <CheckCircle className="h-4 w-4" />
                    {formData.permissions.length} permissions currently assigned
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allPermissions = Object.values(groupedPermissions).flat().map(p => p.name);
                    setFormData(prev => ({ ...prev, permissions: allPermissions }));
                  }}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, permissions: [] }))}
                >
                  Clear All
                </Button>
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <Button
                    key={category}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const categoryPerms = categoryPermissions.map(p => p.name);
                      const allSelected = categoryPerms.every(p => formData.permissions.includes(p));

                      if (allSelected) {
                        // Remove all category permissions
                        setFormData(prev => ({
                          ...prev,
                          permissions: prev.permissions.filter(p => !categoryPerms.includes(p))
                        }));
                      } else {
                        // Add all category permissions
                        setFormData(prev => ({
                          ...prev,
                          permissions: [...new Set([...prev.permissions, ...categoryPerms])]
                        }));
                      }
                    }}
                    className={
                      categoryPermissions.every(p => formData.permissions.includes(p.name))
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    {categoryPermissions.every(p => formData.permissions.includes(p.name)) ? "✓" : "+"} {category}
                  </Button>
                ))}
              </div>

              {/* Selected Permissions Summary */}
              {formData.permissions.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Selected Permissions ({formData.permissions.length})
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, permissions: [] }))}
                      className="text-blue-700 hover:text-blue-900 dark:text-blue-300"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {formData.permissions.map((permission) => (
                      <Badge
                        key={permission}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                      >
                        {permissionService.getPermissionDisplayName(permission)}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission)
                            }));
                          }}
                          className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Compact Permission Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                  const selectedCount = categoryPermissions.filter(p => formData.permissions.includes(p.name)).length;
                  const totalCount = categoryPermissions.length;
                  const allSelected = selectedCount === totalCount;

                  return (
                    <Card key={category} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <CardTitle className="text-sm capitalize">{category}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={allSelected ? "default" : "secondary"} className="text-xs">
                              {selectedCount}/{totalCount}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const categoryPerms = categoryPermissions.map(p => p.name);
                                if (allSelected) {
                                  setFormData(prev => ({
                                    ...prev,
                                    permissions: prev.permissions.filter(p => !categoryPerms.includes(p))
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    permissions: [...new Set([...prev.permissions, ...categoryPerms])]
                                  }));
                                }
                              }}
                              className="h-6 w-6 p-0"
                            >
                              {allSelected ? "−" : "+"}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 gap-1">
                          {categoryPermissions.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(permission.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      permissions: [...prev.permissions, permission.name]
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      permissions: prev.permissions.filter(p => p !== permission.name)
                                    }));
                                  }
                                }}
                                className="h-3 w-3"
                              />
                              <span className="flex-1 text-xs">
                                {permissionService.getPermissionDisplayName(permission)}
                              </span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-3xl mx-auto">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pb-6 text-center">
                  <CardTitle className="text-xl font-semibold">
                    {isEditMode ? "Review Changes" : "Review New Role"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {isEditMode
                      ? "Please review the changes before updating the role"
                      : "Please review the role details before creating"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="grid gap-6">
                    {/* Role Information Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Role Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Role Name</Label>
                            <p className="text-base font-medium mt-1">{formData.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                            <p className="text-base mt-1">
                              {formData.description || (
                                <span className="text-muted-foreground italic">No description provided</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Permissions Card */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Assigned Permissions
                          </CardTitle>
                          <Badge variant="secondary" className="text-sm">
                            {formData.permissions.length} permission{formData.permissions.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {formData.permissions.length > 0 ? (
                          <div className="space-y-4">
                            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                              const selectedPerms = categoryPermissions.filter(p => formData.permissions.includes(p.name));
                              if (selectedPerms.length === 0) return null;

                              return (
                                <div key={category} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm capitalize">{category}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {selectedPerms.length}/{categoryPermissions.length}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedPerms.map((permission) => (
                                      <Badge key={permission.id} variant="secondary" className="text-xs">
                                        {permissionService.getPermissionDisplayName(permission)}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No permissions selected</p>
                            <p className="text-xs">This role will have no access to any features</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Summary Card */}
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                              {isEditMode ? "Ready to Update" : "Ready to Create"}
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {isEditMode
                                ? `The role "${formData.name}" will be updated with ${formData.permissions.length} permissions.`
                                : `The new role "${formData.name}" will be created with ${formData.permissions.length} permissions.`
                              }
                              {isEditMode && existingRole?.user_count && existingRole.user_count > 0 && (
                                <span className="block mt-1 font-medium">
                                  This will affect {existingRole.user_count} user(s) currently assigned to this role.
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
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
          <Button variant="outline" onClick={() => navigate("/roles")}>
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
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Save Changes" : "Create Role"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleWizard;
