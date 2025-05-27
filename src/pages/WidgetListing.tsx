
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Settings, 
  Copy, 
  Eye, 
  MoreVertical,
  Trash2,
  Edit,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import widgetService, { Widget } from "@/services/widgetService";

export default function WidgetListing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const response = await widgetService.getWidgets();
      setWidgets(response || []);
    } catch (error) {
      console.error("Error fetching widgets:", error);
      toast({
        title: "Error",
        description: "Failed to load widgets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWidget = async (id: string | number) => {
    try {
      await widgetService.deleteWidget(String(id));
      setWidgets(widgets.filter((w) => w.id !== id));
      toast({
        title: "Success",
        description: "Widget deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting widget:", error);
      toast({
        title: "Error",
        description: "Failed to delete widget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredWidgets = widgets.filter((widget) =>
    widget.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Widgets</h1>
          <p className="text-muted-foreground">
            Manage your chat widgets and configurations
          </p>
        </div>
        <Button onClick={() => navigate("/widgets/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Widget
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWidgets.map((widget) => (
          <Card key={widget.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{widget.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(`/widgets/edit/${widget.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`/widget-testing/${widget.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteWidget(widget.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {widget.description || "No description"}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <Badge variant={widget.is_active ? "default" : "secondary"}>
                  {widget.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={widget.is_published ? "default" : "outline"}>
                  {widget.is_published ? "Published" : "Draft"}
                </Badge>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/widgets/edit/${widget.id}`)}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/widget-testing/${widget.id}`)}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Test
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWidgets.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No widgets found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "No widgets match your search criteria."
              : "Get started by creating your first widget."}
          </p>
          {!searchTerm && (
            <Button onClick={() => navigate("/widgets/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Widget
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
