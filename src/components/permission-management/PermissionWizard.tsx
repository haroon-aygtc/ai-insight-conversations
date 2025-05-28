import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import permissionService, { Permission } from "@/services/permissionService";

const PermissionWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPermissionSync } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingPermission, setExistingPermission] = useState<Permission | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    guard_name: string;
  }>({
    name: "",
    guard_name: "web"
  });

  const isEditMode = !!id;

  // Check permissions
  const canCreatePermissions = hasPermissionSync('permission.create');
  const canEditPermissions = hasPermissionSync('permission.edit');

  // Permission check
  if (isEditMode && !canEditPermissions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to edit permissions.
          </p>
        </div>
      </div>
    );
  }

  if (!isEditMode && !canCreatePermissions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to create permissions.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);

        // Fetch existing permission if editing
        if (id) {
          const permissionResponse = await permissionService.getPermission(id);
          setExistingPermission(permissionResponse);

          setFormData({
            name: permissionResponse.name || "",
            guard_name: permissionResponse.guard_name || "web"
          });
        }
      } catch (error) {
        console.error('Error fetching permission:', error);
        toast({
          title: "Error",
          description: "Failed to load permission data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Permission name is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.guard_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Guard name is required.",
        variant: "destructive",
      });
      return false;
    }

    // Validate permission name format (should be lowercase with dots/underscores)
    const namePattern = /^[a-z][a-z0-9._]*$/;
    if (!namePattern.test(formData.name)) {
      toast({
        title: "Validation Error",
        description: "Permission name should start with a letter and contain only lowercase letters, numbers, dots, and underscores.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      if (isEditMode && id) {
        await permissionService.updatePermission(id, formData);

        toast({
          title: "Success!",
          description: `Permission "${formData.name}" has been updated successfully.`
        });
      } else {
        await permissionService.createPermission(formData);

        toast({
          title: "Success!",
          description: `Permission "${formData.name}" has been created successfully.`
        });
      }

      navigate('/permissions');
    } catch (error) {
      console.error('Error saving permission:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} permission. Please try again.`,
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
        <span className="ml-2">Loading permission...</span>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/permissions')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Permissions
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditMode ? 'Edit Permission' : 'Create Permission'}
        </h2>
        <p className="text-muted-foreground">
          {isEditMode
            ? `Modify the permission "${existingPermission?.name}"`
            : 'Create a new system permission'
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Details
          </CardTitle>
          <CardDescription>
            Configure the permission name, display name, and organization details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Permission Name *</Label>
              <Input
                id="name"
                placeholder="e.g., user.create, role.edit"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, dots, and underscores. Format: category.action
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guard_name">Guard Name *</Label>
              <Select value={formData.guard_name} onValueChange={(value) => handleInputChange('guard_name', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Authentication guard for this permission
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={() => navigate('/permissions')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Permission' : 'Create Permission'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionWizard;
