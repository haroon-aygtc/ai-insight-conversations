import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import widgetService from "@/services/widgetService";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Settings,
  Code,
  Eye,
  Monitor,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

// Import our new components
import {
  PreviewTab,
  EmbedTab,
  TestingTab,
  WidgetInfoCard,
  QuickActionsCard,
  DevicePreviewCard
} from "@/components/widget-testing"

export default function WidgetTesting() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [widget, setWidget] = useState<any>(null);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string>(id || "");
  const [activeTab, setActiveTab] = useState("preview");
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const environment = "development"; // Default environment for QuickActionsCard
  // Fetch all widgets on component mount
  useEffect(() => {
    fetchWidgets();
  }, []);

  // Fetch specific widget when ID changes
  useEffect(() => {
    if (selectedWidgetId) {
      fetchWidget(selectedWidgetId);
    }
  }, [selectedWidgetId]);

  // Fetch all widgets
  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const data = await widgetService.getWidgets();
      // Ensure data is an array
      const widgetsArray = Array.isArray(data) ? data : [];
      setWidgets(widgetsArray);

      // If no widget ID is provided in URL, select the first widget
      if (!id && widgetsArray.length > 0) {
        setSelectedWidgetId(String(widgetsArray[0].id));
        navigate(`/widget-testing/${widgetsArray[0].id}`, { replace: true });
      }
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

  // Fetch specific widget
  const fetchWidget = async (widgetId: string) => {
    try {
      setLoading(true);
      const data = await widgetService.getWidget(widgetId);
      setWidget(data);
    } catch (error) {
      console.error(`Error fetching widget ${widgetId}:`, error);
      toast({
        title: "Error",
        description: "Failed to load widget. Please try again.",
        variant: "destructive",
      });
      // Redirect to widgets list if widget not found
      navigate("/widgets");
    } finally {
      setLoading(false);
    }
  };

  // Handle widget selection change
  const handleWidgetChange = (value: string) => {
    setSelectedWidgetId(value);
    navigate(`/widget-testing/${value}`);
    setRefreshKey(Date.now());
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey(Date.now());
  };

  // Handle device selection
  const handleDeviceSelect = (_device: "desktop" | "tablet" | "mobile") => {
    // This function is passed to DevicePreviewCard but the device state is not used in this component
    // The actual device switching logic is handled within the DevicePreviewCard component
  };

  return (
    <div
      className="container mx-auto py-8 space-y-8 max-w-7xl"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/widgets")}
            className="hover:bg-blue-100 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Widget Preview & Embed Center</h1>
            <p className="text-sm text-slate-500 mt-1">Test, preview and generate embed codes for your widgets</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none px-3 py-1 rounded-full"
          >
            Testing Center
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={selectedWidgetId} onValueChange={handleWidgetChange}>
              <SelectTrigger className="w-full sm:w-[220px] border-blue-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Select Widget" />
              </SelectTrigger>
              <SelectContent>
                {widgets.map((w) => (
                  <SelectItem key={w.id} value={String(w.id)}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedWidgetId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/widgets/edit/${selectedWidgetId}`)}
              className="bg-white/80 backdrop-blur-sm hover:bg-blue-50 transition-colors duration-200"
            >
              <Settings className="h-4 w-4 mr-1" />
              Edit Widget
            </Button>
          )}
        </div>
      </motion.div>
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-blue-100 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100">
              <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-[50px] w-full" />
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : widget ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedWidgetId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs Navigation */}
              <Card>
                <CardHeader className="pb-0 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 mb-4 bg-blue-100/50">
                      <TabsTrigger
                        value="preview"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger
                        value="embed"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition-all duration-200"
                      >
                        <Code className="h-4 w-4" />
                        Embed Code
                      </TabsTrigger>
                      <TabsTrigger
                        value="testing"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition-all duration-200"
                      >
                        <Monitor className="h-4 w-4" />
                        Advanced Testing
                      </TabsTrigger>
                    </TabsList>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="m-0">
                      <PreviewTab widget={widget} />
                    </TabsContent>

                    {/* Embed Code Tab */}
                    <TabsContent value="embed" className="m-0">
                      <EmbedTab
                        widget={widget}
                        refreshKey={refreshKey}
                        setRefreshKey={setRefreshKey}
                      />
                    </TabsContent>

                    {/* Testing Tab */}
                    <TabsContent value="testing" className="m-0">
                      <TestingTab widget={widget} />
                    </TabsContent>
                  </Tabs>
                </CardHeader>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Widget Info Card */}
              <WidgetInfoCard widget={widget} />

              {/* Quick Actions */}
              <QuickActionsCard
                widgetId={String(widget.id)}
                environment={environment}
                onRefresh={handleRefresh}
              />

              {/* Device Preview Shortcuts */}
              <DevicePreviewCard
                onDeviceSelect={handleDeviceSelect}
                setActiveTab={setActiveTab}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-blue-100 shadow-md">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">No Widget Selected</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Please select a widget from the dropdown above to preview and generate
                  embed code for your widget.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
