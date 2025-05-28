import React, { useState, useEffect, useRef } from "react";
import { Widget } from "@/services/widgetService";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Send,
  ChevronRight,
  Download,
  Settings,
  Layers,
  Code,
  BarChart,
  Save,
  Play,
  Pause,
  Layout,
  Palette,
  Type,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Copy,
  Check,
  X,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { widgetService } from "@/services/widgetService";
import { WidgetAppearanceTab } from "@/components/widget-configurator/WidgetAppearanceTab";
import { WidgetBehaviorTab } from "@/components/widget-configurator/WidgetBehaviorTab";
import { WidgetContentTab } from "@/components/widget-configurator/WidgetContentTab";
import { WidgetEmbeddingTab } from "@/components/widget-configurator/WidgetEmbeddingTab";
import { ModernWidgetPreview } from "@/components/widget-configurator/ModernWidgetPreview";
import DevicePreview from "@/components/widget-configurator/DevicePreview";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WidgetTestingPlatform } from "@/components/widget-configurator/testing/WidgetTestingPlatform";
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
import { Input } from "@/components/ui/input";

// Default widget configuration
const DEFAULT_WIDGET_CONFIG = {
  id: null,
  widget_id: null,
  name: "New Widget",
  description: "My chat widget",
  is_active: true,
  is_published: false,
  status: "draft",
  appearance_config: {
    primaryColor: "#6366f1",
    secondaryColor: "#ffffff",
    borderRadius: 8,
    chatIconSize: 40,
    fontFamily: "inter",
    fontSize: "medium",
    fontWeight: "normal",
    textColor: "#333333",
    headerTextColor: "#ffffff",
    theme: "light",
    iconStyle: "circle",
    customCSS: "",
  },
  behavior_config: {
    autoOpen: "no",
    delay: 5,
    position: "bottom-right",
    animation: "fade",
    mobileBehavior: "responsive",
    showAfterPageViews: 1,
    persistState: true,
    showNotifications: true,
  },
  content_config: {
    welcomeMessage: "Hello! How can I help you today?",
    botName: "AI Assistant",
    inputPlaceholder: "Type a message...",
    chatButtonText: "Chat with us",
    headerTitle: "Chat Support",
    enablePreChatForm: false,
    preChatFormFields: [
      {
        id: "field-name",
        label: "Name",
        type: "text",
        placeholder: "Enter your name",
        required: true
      },
      {
        id: "field-email",
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        required: true
      }
    ],
    preChatFormTitle: "Before we start chatting...",
    preChatFormSubtitle: "Please provide the following information:",
    enableFeedback: false,
    feedbackPosition: "after-bot",
    feedbackOptions: [
      {
        id: "feedback-helpful",
        type: "thumbs",
        question: "Was this helpful?",
        required: true
      }
    ],
    showTypingIndicator: true,
    showAvatar: true,
  },
  embedding_config: {
    allowedDomains: "*",
    widgetId: "",
    enableAnalytics: true,
    gdprCompliance: true,
  },
};

const WidgetConfigurator = () => {
  const navigate = useNavigate();
  const { id: widgetId } = useParams();
  const [configPanel, setConfigPanel] = useState(true);
  const [configTab, setConfigTab] = useState("appearance");
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<'config' | 'test'>('config');
  const [widgetVisible, setWidgetVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const [widgetConfig, setWidgetConfig] = useState(DEFAULT_WIDGET_CONFIG);
  const [widgetHistory, setWidgetHistory] = useState<any[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const historyTimeoutRef = useRef<number | null>(null);

  const isNewWidget = !widgetId || widgetId === 'new';
  const hasChanges = historyPosition > 0;

  // Load widget data
  useEffect(() => {
    if (isSaving || isNewWidget || justSaved || (widgetId && lastSavedId === widgetId)) {
      return;
    }

    if (widgetId && typeof widgetId === 'string' && widgetId.trim() !== '') {
      loadWidget(widgetId);
    } else if (widgetId === undefined &&
      window.location.pathname.includes('/widgets/') &&
      !isNewWidget) {

      const currentPath = window.location.pathname;

      const timeoutId = setTimeout(() => {
        if (window.location.pathname === currentPath && !justSaved) {
          toast({
            title: "Invalid Widget ID",
            description: "No widget ID was provided. Creating a new widget instead.",
            variant: "destructive",
          });

          navigate('/widgets/new');
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [widgetId, navigate, isSaving, justSaved, lastSavedId]);

  // Initialize history when widget config changes from external source
  useEffect(() => {
    // Only initialize history when loading a widget or starting fresh
    if (historyPosition === -1) {
      setWidgetHistory([widgetConfig]);
      setHistoryPosition(0);
    }
  }, [widgetConfig]);

  // Load widget data from the API
  const loadWidget = async (id: string) => {
    try {
      const widget = await widgetService.getWidget(id);

      // Ensure embedding_config.widgetId has a value
      const updatedWidget = {
        ...widget,
        embedding_config: {
          ...widget.embedding_config,
          widgetId: String(widget.embedding_config.widgetId || widget.widget_id || widget.id || ''),
        }
      };

      setWidgetConfig(updatedWidget);
      setWidgetHistory([updatedWidget]);
      setHistoryPosition(0);

      toast({
        title: "Widget Loaded",
        description: `Successfully loaded "${widget.name}"`,
      });
    } catch (error) {
      console.error("Error loading widget:", error);
      toast({
        title: "Error Loading Widget",
        description: "Could not load the requested widget. Creating a new one instead.",
        variant: "destructive",
      });
      navigate('/widgets/new');
    }
  };

  // Track changes to widget configuration
  const handleConfigChange = (section: string, key: string, value: any) => {
    const newConfig = {
      ...widgetConfig,
      [`${section}_config`]: {
        ...widgetConfig[`${section}_config`],
        [key]: value,
      },
    };

    setWidgetConfig(newConfig);

    // Add to history with debounce
    if (historyTimeoutRef.current) {
      window.clearTimeout(historyTimeoutRef.current);
    }

    historyTimeoutRef.current = window.setTimeout(() => {
      // Remove any forward history if we're making a new change from a previous point
      const newHistory = widgetHistory.slice(0, historyPosition + 1);
      newHistory.push(newConfig);

      // Limit history to 50 items
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      setWidgetHistory(newHistory);
      setHistoryPosition(newHistory.length - 1);
    }, 500);
  };

  // Basic widget info changes
  const handleBasicInfoChange = (key: string, value: any) => {
    const newConfig = {
      ...widgetConfig,
      [key]: value,
    };
    setWidgetConfig(newConfig);

    // Add to history with debounce
    if (historyTimeoutRef.current) {
      window.clearTimeout(historyTimeoutRef.current);
    }

    historyTimeoutRef.current = window.setTimeout(() => {
      const newHistory = widgetHistory.slice(0, historyPosition + 1);
      newHistory.push(newConfig);

      if (newHistory.length > 50) {
        newHistory.shift();
      }

      setWidgetHistory(newHistory);
      setHistoryPosition(newHistory.length - 1);
    }, 500);
  };

  // Save widget configuration
  const handleSaveConfiguration = async () => {
    setIsSaving(true);

    try {
      let result;

      if (isNewWidget) {
        result = await widgetService.createWidget(widgetConfig);
        toast({
          title: "Widget Created",
          description: `"${widgetConfig.name}" has been created successfully!`,
        });
      } else {
        result = await widgetService.updateWidget(widgetId!, widgetConfig);
        toast({
          title: "Widget Updated",
          description: `"${widgetConfig.name}" has been updated successfully!`,
        });
      }

      // Update the widget ID and URL if it's a new widget
      if (isNewWidget && result.id) {
        setJustSaved(true);
        setLastSavedId(String(result.id));
        navigate(`/widgets/${result.id}`);

        // Reset flag after navigation
        setTimeout(() => {
          setJustSaved(false);
        }, 500);
      }

      // Update with server values
      setWidgetConfig(result);
      setWidgetHistory([...widgetHistory, result]);
      setHistoryPosition(widgetHistory.length);

    } catch (error) {
      console.error("Error saving widget:", error);

      // Show appropriate error
      toast({
        title: "Error Saving Widget",
        description: "There was a problem saving your widget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Publish widget
  const handlePublishWidget = async () => {
    try {
      if (!widgetConfig.id) {
        toast({
          title: "Save First",
          description: "Please save your widget before publishing.",
          variant: "default",
        });
        return;
      }

      const result = await widgetService.publishWidget(String(widgetConfig.id));

      setWidgetConfig({
        ...widgetConfig,
        is_published: true,
        status: 'published',
      });

      toast({
        title: "Widget Published",
        description: `"${widgetConfig.name}" is now live!`,
      });
    } catch (error) {
      console.error("Error publishing widget:", error);
      toast({
        title: "Error Publishing",
        description: "There was a problem publishing your widget. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Undo/Redo functionality
  const handleUndo = () => {
    if (historyPosition > 0) {
      const newPosition = historyPosition - 1;
      setHistoryPosition(newPosition);
      setWidgetConfig(widgetHistory[newPosition]);
    }
  };

  const handleRedo = () => {
    if (historyPosition < widgetHistory.length - 1) {
      const newPosition = historyPosition + 1;
      setHistoryPosition(newPosition);
      setWidgetConfig(widgetConfig);
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    setWidgetConfig(DEFAULT_WIDGET_CONFIG);
    setWidgetHistory([DEFAULT_WIDGET_CONFIG]);
    setHistoryPosition(0);

    toast({
      title: "Reset to Default",
      description: "Widget configuration has been reset to default settings.",
    });
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-gray-50">
      {/* Top Header with actions */}
      <div className="border-b bg-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Input
                value={widgetConfig.name}
                onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                className="text-xl font-semibold h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Widget Name"
              />
              <Badge
                variant={widgetConfig.is_published ? "default" : "secondary"}
                className="ml-2"
              >
                {widgetConfig.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <Input
              value={widgetConfig.description}
              onChange={(e) => handleBasicInfoChange('description', e.target.value)}
              className="text-sm text-muted-foreground h-6 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Add a description..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  disabled={historyPosition <= 0}
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRedo}
                  disabled={historyPosition >= widgetHistory.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToDefault}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (widgetConfig.id) {
                navigate(`/widget-testing/${widgetConfig.id}`);
              } else {
                toast({
                  title: "Save First",
                  description: "Please save your widget before testing.",
                });
              }
            }}
          >
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveConfiguration}
            disabled={isSaving}
            className="min-w-28"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handlePublishWidget}
            disabled={isSaving || !widgetConfig.id}
            className="min-w-28"
          >
            {widgetConfig.is_published ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Published
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Configuration Panel - collapsible */}
        <div
          className={cn(
            "flex-col border-r bg-white transition-all duration-300 overflow-hidden",
            configPanel ? "flex w-[420px]" : "w-0"
          )}
        >
          <div className="p-4 border-b">
            <Tabs value={configTab} onValueChange={setConfigTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="appearance" className="flex items-center gap-1 text-xs">
                  <Palette className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="behavior" className="flex items-center gap-1 text-xs">
                  <Settings className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Behavior</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-1 text-xs">
                  <Type className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="embedding" className="flex items-center gap-1 text-xs">
                  <Code className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Embed</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="appearance" className="mt-0">
              <WidgetAppearanceTab
                config={widgetConfig.appearance_config}
                onChange={(key, value) => handleConfigChange('appearance', key, value)}
              />
            </TabsContent>

            <TabsContent value="behavior" className="mt-0">
              <WidgetBehaviorTab
                config={widgetConfig.behavior_config}
                onChange={(key, value) => handleConfigChange('behavior', key, value)}
              />
            </TabsContent>

            <TabsContent value="content" className="mt-0">
              <WidgetContentTab
                config={widgetConfig.content_config}
                onChange={(key, value) => handleConfigChange('content', key, value)}
              />
            </TabsContent>

            <TabsContent value="embedding" className="mt-0">
              <WidgetEmbeddingTab
                config={widgetConfig.embedding_config}
                widgetId={widgetConfig.widget_id || widgetConfig.id}
                onChange={(key, value) => handleConfigChange('embedding', key, value)}
              />
            </TabsContent>
          </div>
        </div>

        {/* Toggle for config panel */}
        <button
          onClick={() => setConfigPanel(!configPanel)}
          className="absolute left-[420px] top-1/2 -translate-y-1/2 z-10 bg-white border rounded-r-lg p-1 shadow-md transition-all duration-300"
          style={{
            left: configPanel ? '420px' : '0',
          }}
        >
          {configPanel ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
        </button>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)} className="flex flex-col h-full">
            {/* Preview Controls */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select value={device} onValueChange={(v) => setDevice(v as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        Desktop
                      </div>
                    </SelectItem>
                    <SelectItem value="tablet">
                      <div className="flex items-center">
                        <Tablet className="h-4 w-4 mr-2" />
                        Tablet
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile">
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Mobile
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWidgetVisible(!widgetVisible)}
                >
                  {widgetVisible ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Widget
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Widget
                    </>
                  )}
                </Button>
              </div>

              <TabsList>
                <TabsTrigger value="config">
                  <Layout className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="test">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Test Chat
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TabsContent needs to be a direct child of Tabs */}
            <TabsContent value="config" className="flex-1 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-6 h-full">
              <DevicePreview device={device}>
                <div className="bg-white w-full h-[600px] shadow-lg rounded-lg overflow-hidden relative">
                  {!widgetVisible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
                      <div className="text-center">
                        <EyeOff className="h-16 w-16 mx-auto text-gray-400" />
                        <p className="mt-4 text-gray-600 font-medium">Widget is hidden</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setWidgetVisible(true)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Show Widget
                        </Button>
                      </div>
                    </div>
                  )}
                  <ModernWidgetPreview
                    config={{
                      appearance: widgetConfig.appearance_config,
                      behavior: widgetConfig.behavior_config,
                      content: widgetConfig.content_config,
                      embedding: widgetConfig.embedding_config,
                    }}
                    deviceType={device}
                    forceOpen={device !== 'desktop'}
                  />
                </div>
              </DevicePreview>
            </TabsContent>

            <TabsContent value="test" className="flex-1 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-6 h-full">
              <WidgetTestingPlatform
                widgetId={widgetConfig.widget_id || widgetConfig.id}
                deviceType={device}
                config={{
                  appearance: widgetConfig.appearance_config,
                  behavior: widgetConfig.behavior_config,
                  content: widgetConfig.content_config,
                  embedding: widgetConfig.embedding_config,
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WidgetConfigurator;
