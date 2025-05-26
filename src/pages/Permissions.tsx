import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import apiService from "@/services/api";

interface Permission {
  id: number;
  name: string;
  display_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const Permissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<{ permissions: Permission[] }>(
        "/permissions",
      );
      if (response.data?.permissions) {
        setPermissions(response.data.permissions);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch permissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      display_name: "",
      description: "",
    });
  };

  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.post("/permissions", formData);
      toast({
        title: "Success",
        description: "Permission created successfully",
      });
      setIsCreateDialogOpen(false);
      resetForm();
      fetchPermissions();
    } catch (error) {
      console.error("Error creating permission:", error);
      toast({
        title: "Error",
        description:
          "Failed to create permission. Please check the form and try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (permission: Permission) => {
    setCurrentPermission(permission);
    setFormData({
      name: permission.name,
      display_name: permission.display_name,
      description: permission.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPermission) return;

    try {
      await apiService.put(`/permissions/${currentPermission.id}`, formData);
      toast({
        title: "Success",
        description: "Permission updated successfully",
      });
      setIsEditDialogOpen(false);
      resetForm();
      fetchPermissions();
    } catch (error) {
      console.error("Error updating permission:", error);
      toast({
        title: "Error",
        description:
          "Failed to update permission. Please check the form and try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (permission: Permission) => {
    setCurrentPermission(permission);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePermission = async () => {
    if (!currentPermission) return;

    try {
      await apiService.delete(`/permissions/${currentPermission.id}`);
      toast({
        title: "Success",
        description: "Permission deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      fetchPermissions();
    } catch (error) {
      console.error("Error deleting permission:", error);
      toast({
        title: "Error",
        description: "Failed to delete permission. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Permission Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage system permissions
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Add Permission
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Permission</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new permission.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePermission}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Permission Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="create-users"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      System name for the permission (lowercase, use hyphens)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleInputChange}
                      placeholder="Create Users"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Allows creating new user accounts"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Permission</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead>System Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading permissions...
                    </TableCell>
                  </TableRow>
                ) : permissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No permissions found. Create your first permission to get
                      started.
                    </TableCell>
                  </TableRow>
                ) : (
                  permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div className="font-medium">
                          {permission.display_name}
                        </div>
                      </TableCell>
                      <TableCell>{permission.name}</TableCell>
                      <TableCell>
                        <div className="max-w-md truncate">
                          {permission.description || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(permission)}
                            title="Edit Permission"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(permission)}
                            title="Delete Permission"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Permission Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Update permission information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePermission}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Permission Name</Label>
                <Input
                  id="edit_name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  System name for the permission (lowercase, use hyphens)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_display_name">Display Name</Label>
                <Input
                  id="edit_display_name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Permission</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Permission Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              permission "{currentPermission?.display_name}" and may affect
              roles that have this permission assigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePermission}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Permissions;
