import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";
import apiService from "@/services/api";

interface Permission {
  id: number;
  name: string;
  display_name: string;
  description: string;
}

interface AssignPermissionsToRolesProps {
  roleId: number;
  onComplete: () => void;
}

const AssignPermissionsToRoles: React.FC<AssignPermissionsToRolesProps> = ({
  roleId,
  onComplete,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPermissions();
    fetchRolePermissions();
  }, [roleId]);

  const fetchPermissions = async () => {
    try {
      const response = await apiService.get<{ permissions: Permission[] }>(
        "permissions",
      );
      if (response.data?.permissions) {
        setPermissions(response.data.permissions);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async () => {
    try {
      const response = await apiService.get<{ permissions: number[] }>(
        `/roles/${roleId}/permissions`,
      );
      if (response.data?.permissions) {
        setSelectedPermissions(response.data.permissions);
      }
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch role permissions",
        variant: "destructive",
      });
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.post(`/roles/${roleId}/permissions`, {
        permissions: selectedPermissions,
      });
      toast({
        title: "Success",
        description: "Permissions assigned successfully",
      });
      onComplete();
    } catch (error) {
      console.error("Error assigning permissions:", error);
      toast({
        title: "Error",
        description: "Failed to assign permissions",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredPermissions = permissions.filter((permission) => {
    const query = searchQuery.toLowerCase();
    return (
      permission.name.toLowerCase().includes(query) ||
      permission.display_name.toLowerCase().includes(query) ||
      (permission.description &&
        permission.description.toLowerCase().includes(query))
    );
  });

  // Group permissions by their prefix (before the first hyphen)
  const groupedPermissions = filteredPermissions.reduce<
    Record<string, Permission[]>
  >((groups, permission) => {
    const prefix = permission.name.split("-")[0] || "Other";
    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push(permission);
    return groups;
  }, {});

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search permissions..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">Loading permissions...</div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([group, perms]) => (
              <div key={group} className="space-y-2">
                <h3 className="text-sm font-medium capitalize">{group}</h3>
                <div className="space-y-1">
                  {perms.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start space-x-2 rounded-md p-2 hover:bg-accent"
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() =>
                          handlePermissionToggle(permission.id)
                        }
                      />
                      <div className="grid gap-0.5">
                        <Label
                          htmlFor={`permission-${permission.id}`}
                          className="cursor-pointer"
                        >
                          {permission.display_name}
                        </Label>
                        {permission.description && (
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(groupedPermissions).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No permissions found matching your search.
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default AssignPermissionsToRoles;
