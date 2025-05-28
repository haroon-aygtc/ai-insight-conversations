import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Edit,
  Copy,
  Trash2,
  Plus,
  Search,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle
} from 'lucide-react';
import widgetService, {
  WidgetData,
  AppearanceConfig,
  BehaviorConfig,
  ContentConfig,
  EmbeddingConfig
} from '@/services/widgetService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from '@/components/ui/skeleton';

interface Widget extends WidgetData {
  id: string | number;
  widget_id: string;
  name: string;
  description: string;
  is_active: boolean;
  is_published: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  appearance_config: AppearanceConfig;
  behavior_config: BehaviorConfig;
  content_config: ContentConfig;
  embedding_config: EmbeddingConfig;
  [key: string]: any;
}

const WidgetListing: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [filteredWidgets, setFilteredWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteWidgetId, setDeleteWidgetId] = useState<string | number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicating, setDuplicating] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState<string | number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWidgets();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = widgets.filter(
        widget =>
          widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          widget.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWidgets(filtered);
    } else {
      setFilteredWidgets(widgets);
    }
  }, [searchTerm, widgets]);

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
      setDuplicating(widgetId);

      // Find the original widget
      const originalWidget = widgets.find(w => w.id === widgetId);
      if (!originalWidget) {
        throw new Error('Widget not found');
      }

      // Create a duplicate with modified properties and ensure all required fields
      const duplicateData: WidgetData = {
        name: `${originalWidget.name} (Copy)`,
        description: originalWidget.description || '',
        appearance_config: originalWidget.appearance_config || {
          primaryColor: '#6366f1',
          secondaryColor: '#ffffff',
          borderRadius: 8,
          chatIconSize: 40,
          fontFamily: 'inter',
          fontSize: 'medium',
          fontWeight: 'normal',
          textColor: '#333333',
          headerTextColor: '#ffffff',
          theme: 'light',
          iconStyle: 'circle',
          customCSS: ''
        },
        behavior_config: originalWidget.behavior_config || {
          autoOpen: 'no',
          delay: 5,
          position: 'bottom-right',
          animation: 'fade',
          mobileBehavior: 'responsive',
          showAfterPageViews: 1,
          persistState: true,
          showNotifications: true
        },
        content_config: originalWidget.content_config || {
          welcomeMessage: 'Hello! How can I help you today?',
          botName: 'AI Assistant',
          inputPlaceholder: 'Type a message...',
          chatButtonText: 'Chat with us',
          headerTitle: 'Chat Support',
          enablePreChatForm: false,
          preChatFormFields: [],
          preChatFormTitle: 'Before we start chatting...',
          preChatFormSubtitle: 'Please provide the following information:',
          enableFeedback: false,
          feedbackPosition: 'after-bot',
          feedbackOptions: [],
          showTypingIndicator: true,
          showAvatar: true
        },
        embedding_config: originalWidget.embedding_config || {
          allowedDomains: '*',
          enableAnalytics: true,
          widgetId: `widget_${Date.now()}`,
          gdprCompliance: true
        }
      };

      // Create the new widget
      await widgetService.createWidget(duplicateData);

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

  const handleDeleteWidget = async () => {
    if (!deleteWidgetId) return;

    try {
      setDeleting(deleteWidgetId);
      await widgetService.deleteWidget(String(deleteWidgetId));
      toast({
        title: 'Success',
        description: 'Widget deleted successfully.',
      });
      setDeleteDialogOpen(false);
      fetchWidgets();
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete widget. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
      setDeleteWidgetId(null);
    }
  };

  const openDeleteDialog = (widgetId: string | number) => {
    setDeleteWidgetId(widgetId);
    setDeleteDialogOpen(true);
  };

  const handleViewWidget = (widgetId: string | number) => {
    navigate(`/widgets/preview/${widgetId}`);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Widgets</h1>
          <p className="text-muted-foreground">
            Manage your chat widgets and configurations
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => navigate('/widgets/new')}
        >
          <Plus size={16} />
          Create New Widget
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredWidgets.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-medium">No widgets found</h3>
          <p className="mt-2 text-slate-500">
            {searchTerm
              ? `No widgets match "${searchTerm}". Try a different search term.`
              : "You haven't created any widgets yet. Create your first widget to get started."}
          </p>
          {searchTerm ? (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </Button>
          ) : (
            <Button
              className="mt-4 flex items-center gap-2"
              onClick={() => navigate('/widgets/new')}
            >
              <Plus size={16} />
              Create New Widget
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWidgets.map((widget) => (
            <Card key={widget.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <CardTitle className="text-lg font-semibold truncate">
                      {widget.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={widget.is_active ? "default" : "secondary"}
                    className="ml-2 flex-shrink-0"
                  >
                    {widget.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <p className="text-sm text-slate-500 line-clamp-2">
                  {widget.description || "No description provided"}
                </p>

                <div className="flex items-center mt-4 gap-3">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: widget.appearance_config.primaryColor }}
                  />
                  <span className="text-xs text-slate-500">
                    Last updated: {new Date(widget.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t p-4 bg-slate-50">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleViewWidget(widget.id)}
                >
                  <Eye size={14} />
                  Preview
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/widgets/edit/${widget.id}`)}
                      className="flex items-center gap-2"
                    >
                      <Edit size={14} />
                      Edit Widget
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicateWidget(widget.id)}
                      disabled={duplicating === widget.id}
                      className="flex items-center gap-2"
                    >
                      <Copy size={14} />
                      {duplicating === widget.id ? 'Duplicating...' : 'Duplicate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(widget.id)}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <Trash2 size={14} />
                      Delete Widget
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Widget</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this widget? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWidget}
              disabled={deleting !== null}
              className="flex items-center gap-2"
            >
              {deleting !== null ? (
                <>Deleting...</>
              ) : (
                <>
                  <Trash2 size={14} />
                  Delete Widget
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
