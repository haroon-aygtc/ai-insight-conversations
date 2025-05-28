import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, Shield, Users, Edit, Trash, Loader2, Filter, MoreHorizontal } from "lucide-react";
import roleService, { Role, GroupedPermissions } from "@/services/roleService";
import permissionService from "@/services/permissionService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Permission } from "@/services/roleService";

const RoleManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPermissionSync } = useAuth();

  const [roles, setRoles] = useState<Role[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermissions>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("roles");
  const [loading, setLoading] = useState(true);
  const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);

  // Check permissions (using dynamic permission names)
  const canViewRoles = hasPermissionSync('role.view');
  const canCreateRoles = hasPermissionSync('role.create');
  const canEditRoles = hasPermissionSync('role.edit');
  const canDeleteRoles = hasPermissionSync('role.delete');
  const canViewPermissions = hasPermissionSync('permission.view');

  // Permission check
  if (!canViewRoles) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to view roles.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!canViewRoles) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch roles
        const rolesResponse = await roleService.getRoles();
        setRoles(rolesResponse.roles);

        // Fetch permissions if user can view them
        if (canViewPermissions) {
          const permissionsResponse = await roleService.getPermissions();
          setGroupedPermissions(permissionsResponse.groupedPermissions);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
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
  }, [canViewRoles, canViewPermissions, toast]);

  const handleDeleteRole = async (roleId: number) => {
    if (!canDeleteRoles) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to delete roles.",
        variant: "destructive",
      });
      return;
    }

    try {
      setDeletingRoleId(roleId);
      await roleService.deleteRole(roleId.toString());
      toast({
        title: "Success",
        description: "Role deleted successfully.",
      });
      // Refresh the list by removing the deleted role
      setRoles(roles.filter(role => role.id !== roleId));
    } catch (err) {
      console.error('Error deleting role:', err);
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingRoleId(null);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Manage roles, permissions and access control
          </p>
        </div>
        {canCreateRoles && (
          <Button onClick={() => navigate("/roles/create")} size="lg">
            <Plus className="mr-2 h-4 w-4" /> Add New Role
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{roles.length}</p>
                <p className="text-xs text-muted-foreground">Total Roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {roles.filter(role => role.name?.toLowerCase().includes('admin')).length}
                </p>
                <p className="text-xs text-muted-foreground">Admin Roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {roles.reduce((total, role) => total + (role.user_count || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">Users with Roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="roles">
              <Shield className="h-4 w-4 mr-2" />
              Roles ({roles.length})
            </TabsTrigger>
            {canViewPermissions && (
              <TabsTrigger value="permissions">
                <Shield className="h-4 w-4 mr-2" />
                Permissions ({Object.values(groupedPermissions).flat().length})
              </TabsTrigger>
            )}
          </TabsList>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                className="pl-10 max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>System Roles</CardTitle>
              <CardDescription>
                All roles with specific permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {(role.name || 'R').substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium">{role.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{role.description || 'No description'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions_list && role.permissions_list.length > 0 ? (
                            role.permissions_list.length > 3 ? (
                              <>
                                {role.permissions_list.slice(0, 2).map((permName) => (
                                  <Badge key={permName} variant="outline">
                                    {permissionService.getPermissionDisplayName(permName)}
                                  </Badge>
                                ))}
                                <Badge variant="outline">+{role.permissions_list.length - 2} more</Badge>
                              </>
                            ) : (
                              role.permissions_list.map((permName) => (
                                <Badge key={permName} variant="outline">
                                  {permissionService.getPermissionDisplayName(permName)}
                                </Badge>
                              ))
                            )
                          ) : (
                            <Badge variant="secondary">No permissions</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          {role.user_count || 0}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEditRoles && (
                              <DropdownMenuItem onClick={() => navigate(`/roles/edit/${role.id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Role
                              </DropdownMenuItem>
                            )}
                            {canDeleteRoles && role.name !== "Administrator" && role.name !== "Super Admin" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete Role
                                    {deletingRoleId === role.id && (
                                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                    )}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the role "{role.name}".
                                      {role.user_count && role.user_count > 0 && (
                                        <span className="block mt-2 text-destructive font-medium">
                                          Warning: This role is currently assigned to {role.user_count} user(s).
                                        </span>
                                      )}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteRole(role.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {roles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No roles found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewPermissions && (
          <TabsContent value="permissions" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    System Permissions
                  </CardTitle>
                  <CardDescription>
                    All available permissions in the system organized by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(groupedPermissions).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                        <Card key={category} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base capitalize">{category}</CardTitle>
                              <Badge variant="secondary" className="text-xs">
                                {categoryPermissions.length} permission{categoryPermissions.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            <CardDescription>
                              {category === "system"
                                ? "System-level permissions with extensive access"
                                : `Permissions related to ${category.toLowerCase()} features`}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {categoryPermissions.map((permission) => (
                                <div key={permission.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                                  <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm">
                                      {permissionService.getPermissionDisplayName(permission)}
                                    </p>
                                    <p className="text-xs text-muted-foreground break-all">{permission.name}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Permissions Found</h3>
                      <p className="text-muted-foreground">
                        {loading ? "Loading permissions..." : "Unable to load permissions from the server."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoleManagement;
