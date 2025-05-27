import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { widgetService } from "@/services/widgetService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Smartphone,
  Tablet,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Layers,
  Package,
  Info,
} from "lucide-react";
import { WidgetTestingContainer } from "@/components/widget-configurator/testing/WidgetTestingContainer";
import { WidgetPreview } from "@/components/widget-configurator/WidgetPreview";
import {
  generateScriptEmbed,
  generateIframeEmbed,
  generateWebComponentEmbed,
  generateOneLineEmbed,
  generateNpmInstallCommand,
} from "@/utils/embedCodeGenerator";
import { motion, AnimatePresence } from "framer-motion";

export default function WidgetTesting() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [widget, setWidget] = useState<any>(null);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string>(id || "");
  const [activeTab, setActiveTab] = useState("preview");
  const [embedType, setEmbedType] = useState("script");
  const [environment, setEnvironment] = useState("development");
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

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

  // Handle environment change
  const handleEnvironmentChange = (value: string) => {
    setEnvironment(value);
  };

  // Generate embed code based on selected type
  const getEmbedCode = () => {
    if (!widget) return "";

    const widgetId = String(widget.id);
    const config = {
      appearance: widget.appearance_config || {},
      behavior: widget.behavior_config || {},
      content: widget.content_config || {},
      embedding: widget.embedding_config || {},
      // Include any additional configuration sections
      allowedDomains: widget.embedding_config?.allowedDomains || "*",
      isActive: widget.is_active !== false,
      isPublished: widget.is_published === true,
      widgetName: widget.name || "AI Chat Widget",
      lastUpdated: widget.updated_at || new Date().toISOString(),
    };

    switch (embedType) {
      case "script":
        return generateScriptEmbed(widgetId, config, environment);
      case "iframe":
        return generateIframeEmbed(widgetId, config, environment);
      case "webcomponent":
        return generateWebComponentEmbed(widgetId, config, environment);
      case "oneline":
        return generateOneLineEmbed(widgetId, environment, config);
      case "npm":
        return generateNpmInstallCommand(widgetId, config);
      default:
        return generateScriptEmbed(widgetId, config, environment);
    }
  };

  // Copy embed code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Refresh the preview
  const handleRefresh = () => {
    setRefreshKey(Date.now());
  };

  // Get environment badge color
  const getEnvironmentBadgeColor = () => {
    switch (environment) {
      case "production":
        return "bg-red-500 hover:bg-red-600";
      case "staging":
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
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
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
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
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="p-0 bg-gradient-to-b from-white to-blue-50 rounded-b-lg"
                      >
                        <div className="p-6">
                          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100">
                            <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                              </div>
                              <div className="text-xs text-slate-500">{widget.name} - Preview</div>
                              <div></div>
                            </div>
                            <WidgetPreview config={widget} />
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>

                    {/* Embed Code Tab */}
                    <TabsContent value="embed" className="m-0">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="p-6 space-y-6 bg-gradient-to-b from-white to-blue-50 rounded-b-lg"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                          <div className="space-y-1">
                            <h3 className="text-lg font-medium text-blue-800">
                              Embed Code Generator
                            </h3>
                            <p className="text-sm text-slate-500">
                              Choose the embed type and environment to generate the code
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Select
                              value={environment}
                              onValueChange={handleEnvironmentChange}
                            >
                              <SelectTrigger className="w-[140px] border-blue-200">
                                <SelectValue placeholder="Environment" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="development">Development</SelectItem>
                                <SelectItem value="staging">Staging</SelectItem>
                                <SelectItem value="production">Production</SelectItem>
                              </SelectContent>
                            </Select>
                            <Badge className={getEnvironmentBadgeColor()}>
                              {environment.charAt(0).toUpperCase() + environment.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <TooltipProvider>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                            <Button
                              variant={embedType === "script" ? "default" : "outline"}
                              onClick={() => setEmbedType("script")}
                              className="justify-start"
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center">
                                    <Code className="h-4 w-4 mr-2" />
                                    JavaScript
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Standard JavaScript embed code with full configuration</p>
                                </TooltipContent>
                              </Tooltip>
                            </Button>
                            <Button
                              variant={embedType === "iframe" ? "default" : "outline"}
                              onClick={() => setEmbedType("iframe")}
                              className="justify-start"
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center">
                                    <Monitor className="h-4 w-4 mr-2" />
                                    iFrame
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Embed as an iframe for isolated environments</p>
                                </TooltipContent>
                              </Tooltip>
                            </Button>
                            <Button
                              variant={embedType === "webcomponent" ? "default" : "outline"}
                              onClick={() => setEmbedType("webcomponent")}
                              className="justify-start"
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center">
                                    <Layers className="h-4 w-4 mr-2" />
                                    Web Component
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Modern web component implementation</p>
                                </TooltipContent>
                              </Tooltip>
                            </Button>
                            <Button
                              variant={embedType === "oneline" ? "default" : "outline"}
                              onClick={() => setEmbedType("oneline")}
                              className="justify-start"
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center">
                                    <Smartphone className="h-4 w-4 mr-2" />
                                    One-Line
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Simplified one-line embed for non-technical users</p>
                                </TooltipContent>
                              </Tooltip>
                            </Button>
                            <Button
                              variant={embedType === "npm" ? "default" : "outline"}
                              onClick={() => setEmbedType("npm")}
                              className="justify-start"
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center">
                                    <Package className="h-4 w-4 mr-2" />
                                    NPM/Yarn
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>NPM/Yarn package installation and usage</p>
                                </TooltipContent>
                              </Tooltip>
                            </Button>
                          </div>
                        </TooltipProvider>

                        <div className="relative group">
                          <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white p-3 rounded-t-md flex justify-between items-center">
                            <div className="flex items-center">
                              <Info className="h-4 w-4 mr-2 text-blue-400" />
                              <span className="text-sm">
                                {embedType === "script" && "JavaScript Embed Code"}
                                {embedType === "iframe" && "iFrame Embed Code"}
                                {embedType === "webcomponent" && "Web Component Embed Code"}
                                {embedType === "oneline" && "One-Line Embed Code"}
                                {embedType === "npm" && "NPM/Yarn Installation"}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">
                              Environment: {environment.charAt(0).toUpperCase() + environment.slice(1)}
                            </div>
                          </div>
                          <pre className="bg-slate-900 text-white p-6 rounded-b-md overflow-x-auto text-sm font-mono whitespace-pre-wrap max-h-[400px] overflow-y-auto border-t border-slate-700 shadow-lg">
                            <code>{getEmbedCode()}</code>
                          </pre>
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                              onClick={handleCopyCode}
                            >
                              {copied ? (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                          <Button
                            variant="outline"
                            onClick={handleRefresh}
                            className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                            onClick={() => {
                              const testPageUrl = `${window.location.origin}/widget-test-page.html?widgetId=${widget.id}&env=${environment}`;
                              window.open(testPageUrl, "_blank");
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open Test Page
                          </Button>
                        </div>
                      </motion.div>
                    </TabsContent>

                    {/* Testing Tab */}
                    <TabsContent value="testing" className="m-0">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="p-0 bg-gradient-to-b from-white to-blue-50 rounded-b-lg"
                      >
                        <WidgetTestingContainer
                          widgetId={String(widget.id)}
                          config={widget}
                          initialTab="preview"
                        />
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </CardHeader>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Widget Info Card */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                    Widget Information
                  </CardTitle>
                  <CardDescription>
                    Details about the selected widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
                    <h4 className="text-sm font-medium mb-1 text-blue-800">Name</h4>
                    <p className="text-sm font-medium">{widget.name}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                    <h4 className="text-sm font-medium mb-1 text-slate-700">Description</h4>
                    <p className="text-sm text-slate-600">
                      {widget.description || "No description provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Status</h4>
                      <Badge variant={widget.is_active ? "default" : "secondary"} className={widget.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}>
                        {widget.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Published</h4>
                      <Badge
                        variant={widget.is_published ? "default" : "outline"}
                        className={widget.is_published ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "border-slate-300 text-slate-800"}
                      >
                        {widget.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-4 bg-slate-50/80 p-3 rounded-md border border-slate-100">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium mb-1 text-slate-700">Created</h4>
                      <p className="text-sm text-slate-600">
                        {new Date(widget.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-medium mb-1 text-slate-700">Last Updated</h4>
                      <p className="text-sm text-slate-600">
                        {new Date(widget.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-white to-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
                    onClick={() => navigate(`/widgets/edit/${selectedWidgetId}`)}
                  >
                    <Settings className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform duration-300" />
                    Edit Widget Configuration
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-white to-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
                    onClick={() => {
                      const testPageUrl = `${window.location.origin}/widget-test-page.html?widgetId=${widget.id}&env=${environment}`;
                      window.open(testPageUrl, "_blank");
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Open in Test Page
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-white to-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh Preview
                  </Button>
                </CardContent>
              </Card>

              {/* Device Preview Shortcuts */}
              <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
                    Device Preview
                  </CardTitle>
                  <CardDescription>Test on different devices</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center py-4"
                      onClick={() => {
                        setActiveTab("preview");
                        // Additional logic to set desktop view
                      }}
                    >
                      <Monitor className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-xs">Desktop</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center py-4"
                      onClick={() => {
                        setActiveTab("preview");
                        // Additional logic to set tablet view
                      }}
                    >
                      <Tablet className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-xs">Tablet</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center py-4"
                      onClick={() => {
                        setActiveTab("preview");
                        // Additional logic to set mobile view
                      }}
                    >
                      <Smartphone className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-xs">Mobile</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
