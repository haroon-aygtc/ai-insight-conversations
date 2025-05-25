import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";
import apiService from "@/services/api";

interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
}

interface AssignRolesToUsersProps {
  userId: number;
  onComplete: () => void;
}

const AssignRolesToUsers: React.FC<AssignRolesToUsersProps> = ({
  userId,
  onComplete,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
    fetchUserRoles();
  }, [userId]);

  const fetchRoles = async () => {
    try {
      const response = await apiService.get<{ roles: Role[] }>("/roles");
      if (response.data?.roles) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const response = await apiService.get<{ roles: number[] }>(
        `/users/${userId}/roles`,
      );
      if (response.data?.roles) {
        setSelectedRoles(response.data.roles);
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user roles",
        variant: "destructive",
      });
    }
  };

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.post(`/users/${userId}/roles`, {
        roles: selectedRoles,
      });
      toast({
        title: "Success",
        description: "Roles assigned successfully",
      });
      onComplete();
    } catch (error) {
      console.error("Error assigning roles:", error);
      toast({
        title: "Error",
        description: "Failed to assign roles",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredRoles = roles.filter((role) => {
    const query = searchQuery.toLowerCase();
    return (
      role.name.toLowerCase().includes(query) ||
      role.display_name.toLowerCase().includes(query) ||
      (role.description && role.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search roles..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">Loading roles...</div>
      ) : (
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {filteredRoles.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No roles found matching your search.
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-start space-x-2 rounded-md p-2 hover:bg-accent"
                >
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={() => handleRoleToggle(role.id)}
                  />
                  <div className="grid gap-0.5">
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="cursor-pointer"
                    >
                      {role.display_name}
                    </Label>
                    {role.description && (
                      <p className="text-xs text-muted-foreground">
                        {role.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
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

export default AssignRolesToUsers;
