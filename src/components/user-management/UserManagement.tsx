import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Edit,
  Trash,
  Lock,
  User,
  Search,
  Filter,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useAuth } from "@/contexts/AuthContext";
import userService, { UserListResponse } from "@/services/userService";
import { User as UserType } from "@/services/auth";

const UserManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPermissionSync } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const perPage = 10;

  // Check permissions
  const canViewUsers = hasPermissionSync('user.view');
  const canCreateUsers = hasPermissionSync('user.create');
  const canEditUsers = hasPermissionSync('user.edit');
  const canDeleteUsers = hasPermissionSync('user.delete');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers(currentPage, perPage, searchTerm);
      setUsers(response.users);
      setTotalUsers(response.total);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canViewUsers) {
      fetchUsers();
    } else {
      setLoading(false);
      setError('You do not have permission to view users');
    }
  }, [currentPage, searchTerm, canViewUsers]);

  const handleDeleteUser = async (userId: number) => {
    if (!canDeleteUsers) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to delete users.",
        variant: "destructive",
      });
      return;
    }

    try {
      setDeletingUserId(userId);
      await userService.deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = user.full_name || '';
    const email = user.email || '';
    const searchLower = searchTerm.toLowerCase();

    return (
      fullName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      (user.roles && user.roles.some(role => {
        if (typeof role === 'string') {
          return role.toLowerCase().includes(searchLower);
        } else if (role && typeof role === 'object' && role.name) {
          return role.name.toLowerCase().includes(searchLower);
        }
        return false;
      }))
    );
  });

  // Permission check - if user can't view users, show access denied
  if (!canViewUsers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to view users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, permissions and access control
          </p>
        </div>
        {canCreateUsers && (
          <Button onClick={() => navigate("/users/create")} size="lg">
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.roles && u.roles.some(role => {
                  if (typeof role === 'string') {
                    return role.toLowerCase().includes('admin');
                  } else if (role && typeof role === 'object' && role.name) {
                    return role.name.toLowerCase().includes('admin');
                  }
                  return false;
                })).length}</p>
                <p className="text-xs text-muted-foreground">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.roles.length > 0).length}</p>
                <p className="text-xs text-muted-foreground">Users with Roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
            <TabsTrigger value="admins">Administrators ({users.filter(u => u.roles && u.roles.some(role => {
              if (typeof role === 'string') {
                return role.toLowerCase().includes('admin');
              } else if (role && typeof role === 'object' && role.name) {
                return role.name.toLowerCase().includes('admin');
              }
              return false;
            })).length})</TabsTrigger>
            <TabsTrigger value="staff">Staff ({users.filter(u => u.roles && u.roles.some(role => {
              if (typeof role === 'string') {
                return role.toLowerCase().includes('editor') || role.toLowerCase().includes('support');
              } else if (role && typeof role === 'object' && role.name) {
                return role.name.toLowerCase().includes('editor') || role.name.toLowerCase().includes('support');
              }
              return false;
            })).length})</TabsTrigger>
            <TabsTrigger value="clients">Clients ({users.filter(u => u.roles && u.roles.some(role => {
              if (typeof role === 'string') {
                return role.toLowerCase().includes('viewer') || role.toLowerCase().includes('user');
              } else if (role && typeof role === 'object' && role.name) {
                return role.name.toLowerCase().includes('viewer') || role.name.toLowerCase().includes('user');
              }
              return false;
            })).length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
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

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>System Users</CardTitle>
              <CardDescription>
                All users with access to the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {(user.full_name || user.first_name || user.email || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium">{user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles && user.roles.length > 0 ? user.roles.map((role, index) => {
                              const roleName = typeof role === 'string' ? role : (role && role.name) || 'Unknown';
                              const roleNameLower = roleName.toLowerCase();

                              return (
                                <Badge key={index} variant={
                                  roleNameLower.includes('admin') ? "default" :
                                    roleNameLower.includes('editor') ? "secondary" :
                                      "outline"
                                }>
                                  {roleName}
                                </Badge>
                              );
                            }) : (
                              <Badge variant="outline">No roles</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="px-3 py-1 rounded-full text-xs inline-flex items-center font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                            <div className="w-1.5 h-1.5 rounded-full mr-2 bg-green-600" />
                            Active
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">Recently</TableCell>
                        <TableCell className="text-sm">Main Organization</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canEditUsers && (
                                <DropdownMenuItem onClick={() => navigate(`/users/edit/${user.id}`)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Lock className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              {canDeleteUsers && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Delete User
                                      {deletingUserId === user.id && (
                                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                      )}
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user account for {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteUser(user.id)}
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
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No users found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Administrator Accounts</h3>
                <p className="text-muted-foreground mb-4">
                  {users.filter(u => u.roles && u.roles.some(role => {
                    if (typeof role === 'string') {
                      return role.toLowerCase().includes('admin');
                    } else if (role && typeof role === 'object' && role.name) {
                      return role.name.toLowerCase().includes('admin');
                    }
                    return false;
                  })).length} administrators with full system access
                </p>
                <Button onClick={() => navigate("/users/create")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Administrator
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Staff Accounts</h3>
                <p className="text-muted-foreground mb-4">
                  Editors and support agents with limited access
                </p>
                <Button onClick={() => navigate("/users/create")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Client Accounts</h3>
                <p className="text-muted-foreground mb-4">
                  Viewer accounts with read-only access
                </p>
                <Button onClick={() => navigate("/users/create")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
