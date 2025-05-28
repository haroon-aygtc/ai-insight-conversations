import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  Bot,
  Shield,
  Globe,
  Palette
} from "lucide-react";

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  enabled: boolean;
}

const VisualPermissions = ({ rolePermissions = [], onPermissionChange }: {
  rolePermissions: string[];
  onPermissionChange: (permissions: string[]) => void;
}) => {


  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    // Initialize permissions with the rolePermissions
    const updatedPermissions = permissions.map(perm => ({
      ...perm,
      enabled: Array.isArray(rolePermissions) && rolePermissions.includes(perm.id)
    }));

    setPermissions(updatedPermissions);
  }, [rolePermissions]);

  const categoryColors = {
    "General": "bg-blue-100 text-blue-800",
    "User Management": "bg-orange-100 text-orange-800",
    "Role Management": "bg-purple-100 text-purple-800",
    "Permission Management": "bg-red-100 text-red-800",
    "Widgets": "bg-pink-100 text-pink-800",
    "AI": "bg-indigo-100 text-indigo-800",
    "Analytics": "bg-yellow-100 text-yellow-800",
    "System": "bg-gray-100 text-gray-800"
  };

  const togglePermission = (permissionId: string) => {
    const updatedPermissions = permissions.map(p =>
      p.id === permissionId ? { ...p, enabled: !p.enabled } : p
    );
    setPermissions(updatedPermissions);

    const enabledPermissions = updatedPermissions
      .filter(p => p.enabled)
      .map(p => p.id);

    onPermissionChange(enabledPermissions);
  };

  const categorizedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Permission Settings</h3>
        <p className="text-muted-foreground">
          Toggle permissions on or off to control what this role can access
        </p>
      </div>

      {Object.entries(categorizedPermissions).map(([category, perms]) => (
        <Card key={category}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{category}</CardTitle>
              <Badge className={categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"} variant="secondary">
                {perms.filter(p => p.enabled).length} of {perms.length} enabled
              </Badge>
            </div>
            <CardDescription>
              {category === "System"
                ? "High-level permissions with extensive access"
                : `Permissions for ${category.toLowerCase()} features`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {perms.map((permission) => (
                <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <permission.icon className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{permission.name}</h4>
                        {permission.id === "all" && (
                          <Badge variant="destructive" className="text-xs">
                            High Risk
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={permission.enabled}
                    onCheckedChange={() => togglePermission(permission.id)}
                    className="ml-4"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VisualPermissions;
