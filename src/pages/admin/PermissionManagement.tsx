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
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, Shield, Edit, Trash, Loader2 } from "lucide-react";
import permissionService, { Permission, GroupedPermissions } from "@/services/permissionService";

const PermissionManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPermissionSync } = useAuth();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermissions>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Check permissions (using dynamic permission names)
  const canViewPermissions = hasPermissionSync('permission.view');
  const canCreatePermissions = hasPermissionSync('permission.create');
  const canEditPermissions = hasPermissionSync('permission.edit');
  const canDeletePermissions = hasPermissionSync('permission.delete');

  // Permission check
  if (!canViewPermissions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to view permissions.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!canViewPermissions) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch permissions
        const permissionsResponse = await permissionService.getPermissions(1, 1000, searchTerm);
        setPermissions(permissionsResponse.permissions);
        setGroupedPermissions(permissionsResponse.groupedPermissions);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        toast({
          title: "Error",
          description: "Failed to load permissions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canViewPermissions, searchTerm, toast]);

  // Filter permissions based on search term
  const filteredPermissions = permissions.filter(permission => {
    const name = permission.name || '';
    const searchLower = searchTerm.toLowerCase();
    return name.toLowerCase().includes(searchLower);
  });

  // Group filtered permissions by category
  const filteredGroupedPermissions = Object.entries(groupedPermissions).reduce((acc, [category, categoryPermissions]) => {
    const filtered = categoryPermissions.filter(permission => {
      const name = permission.name || '';
      const searchLower = searchTerm.toLowerCase();
      return name.toLowerCase().includes(searchLower);
    });

    if (filtered.length > 0) {
      acc[category] = filtered;
    }

    return acc;
  }, {} as GroupedPermissions);

  const handleDeletePermission = async (permission: Permission) => {
    setPermissionToDelete(permission);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePermission = async () => {
    if (!permissionToDelete) return;

    try {
      setDeleting(true);
      await permissionService.deletePermission(permissionToDelete.id.toString());

      setPermissions(permissions.filter(permission => permission.id !== permissionToDelete.id));

      // Update grouped permissions as well
      const updatedGroupedPermissions = { ...groupedPermissions };
      Object.keys(updatedGroupedPermissions).forEach(category => {
        updatedGroupedPermissions[category] = updatedGroupedPermissions[category].filter(
          permission => permission.id !== permissionToDelete.id
        );
      });
      setGroupedPermissions(updatedGroupedPermissions);

      toast({
        title: "Success!",
        description: `Permission "${permissionToDelete.name}" has been deleted successfully.`
      });
    } catch (error) {
      console.error('Error deleting permission:', error);
      toast({
        title: "Error",
        description: "Failed to delete permission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setPermissionToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading permissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Permission Management</h2>
        <p className="text-muted-foreground">
          Manage system permissions and their organization.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {canCreatePermissions && (
          <Button onClick={() => navigate("/permissions/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Permission
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            <Shield className="h-4 w-4 mr-2" />
            All Permissions ({permissions.length})
          </TabsTrigger>
          <TabsTrigger value="grouped">
            <Shield className="h-4 w-4 mr-2" />
            By Category ({Object.keys(groupedPermissions).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All System Permissions</CardTitle>
              <CardDescription>
                Complete list of all permissions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission Name</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Guard</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-mono text-sm">{permission.name}</TableCell>
                      <TableCell className="font-medium">
                        {permissionService.getPermissionDisplayName(permission)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {permission.name.split('.')[0] || 'other'}
                        </Badge>
                      </TableCell>
                      <TableCell>{permission.guard_name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {canEditPermissions && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/permissions/edit/${permission.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canDeletePermissions && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePermission(permission)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredPermissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No permissions found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grouped" className="space-y-6">
          {Object.entries(filteredGroupedPermissions).map(([category, categoryPermissions]) => (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">{category}</CardTitle>
                    <CardDescription>
                      {categoryPermissions.length} permission{categoryPermissions.length !== 1 ? 's' : ''} in this category
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {categoryPermissions.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3 flex-1">
                        <Shield className="h-4 w-4 text-primary shrink-0 mt-1" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">
                            {permissionService.getPermissionDisplayName(permission)}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono break-all">
                            {permission.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        {canEditPermissions && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/permissions/edit/${permission.id}`)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        {canDeletePermissions && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeletePermission(permission)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(filteredGroupedPermissions).length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Permissions Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "No permissions match your search criteria." : "No permissions available."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the permission "{permissionToDelete?.name}"?
              This action cannot be undone and may affect system functionality.
              <span className="block mt-2 text-destructive font-medium">
                Warning: Deleting system permissions can break application functionality.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePermission}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Permission'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PermissionManagement;
